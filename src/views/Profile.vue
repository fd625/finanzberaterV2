<template>
  <div class="profile">
    <div
      v-if="!isAuthenticated"
      class="login-prompt"
    >
      <h2>Profil</h2>
      <p>Bitte melden Sie sich an, um Ihr Profil zu bearbeiten.</p>
      <div class="login-prompt__icon">
        <i
          class="pi pi-user"
          style="font-size: 4rem; color: #ccc;"
        />
      </div>
    </div>

    <div
      v-else
      class="profile-content"
    >
      <div class="profile__header">
        <div class="headline">
          Mein Profil
        </div>
        <div class="profile-info">
          <span class="email">{{ user.email }}</span>
          <span class="join-date">Mitglied seit: {{ formatJoinDate(user.created_at) }}</span>
        </div>
      </div>

      <div class="profile-cards">
        <!-- Grundinformationen -->
        <div class="profile-card">
          <h3>
            <i class="pi pi-user" />
            Grundinformationen
          </h3>

          <div
            v-if="!editingBasic"
            class="card-content"
          >
            <div class="info-row">
              <label>Benutzername:</label>
              <span>{{ userProfile?.username || 'Nicht gesetzt' }}</span>
            </div>
            <div class="info-row">
              <label>Gehalt:</label>
              <span>{{ userProfile?.salary ? formatCurrency(userProfile.salary) : 'Nicht gesetzt' }}</span>
            </div>
            <button
              class="edit-btn"
              @click="startEditingBasic"
            >
              <i class="pi pi-pencil" /> Bearbeiten
            </button>
          </div>

          <div
            v-else
            class="card-content editing"
          >
            <div
              v-if="basicError"
              class="error-message"
            >
              {{ basicError }}
            </div>

            <div class="form-group">
              <label>Benutzername:</label>
              <input
                v-model="editBasic.username"
                type="text"
                placeholder="Ihr Benutzername"
                :disabled="loadingBasic"
              >
            </div>
            <div class="form-group">
              <label>Gehalt (€):</label>
              <input
                v-model="editBasic.salary"
                type="number"
                placeholder="50000"
                :disabled="loadingBasic"
                step="0.01"
                min="0"
              >
            </div>

            <div class="button-group">
              <button
                class="save-btn"
                :disabled="loadingBasic"
                @click="saveBasicInfo"
              >
                <i class="pi pi-check" /> {{ loadingBasic ? 'Speichert...' : 'Speichern' }}
              </button>
              <button
                class="cancel-btn"
                :disabled="loadingBasic"
                @click="cancelEditingBasic"
              >
                <i class="pi pi-times" /> Abbrechen
              </button>
            </div>
          </div>
        </div>

        <!-- Passwort ändern -->
        <div class="profile-card">
          <h3>
            <i class="pi pi-lock" />
            Passwort ändern
          </h3>

          <div
            v-if="!changingPassword"
            class="card-content"
          >
            <p>Sie können hier ein neues Passwort festlegen.</p>
            <button
              class="edit-btn"
              @click="startChangingPassword"
            >
              <i class="pi pi-key" /> Passwort ändern
            </button>
          </div>

          <div
            v-else
            class="card-content editing"
          >
            <div
              v-if="passwordError"
              class="error-message"
            >
              {{ passwordError }}
            </div>
            <div
              v-if="passwordSuccess"
              class="success-message"
            >
              {{ passwordSuccess }}
            </div>

            <div class="form-group">
              <label>Neues Passwort:</label>
              <input
                v-model="passwordData.newPassword"
                type="password"
                placeholder="Mindestens 6 Zeichen"
                :disabled="loadingPassword"
              >
            </div>
            <div class="form-group">
              <label>Passwort bestätigen:</label>
              <input
                v-model="passwordData.confirmPassword"
                type="password"
                placeholder="Passwort wiederholen"
                :disabled="loadingPassword"
              >
            </div>

            <div class="button-group">
              <button
                class="save-btn"
                :disabled="loadingPassword"
                @click="changePassword"
              >
                <i class="pi pi-check" /> {{ loadingPassword ? 'Ändert...' : 'Passwort ändern' }}
              </button>
              <button
                class="cancel-btn"
                :disabled="loadingPassword"
                @click="cancelChangingPassword"
              >
                <i class="pi pi-times" /> Abbrechen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
    name: "Profile",

    data() {
        return {
            editingBasic: false,
            loadingBasic: false,
            basicError: null,
            editBasic: { username: "", salary: null },

            changingPassword: false,
            loadingPassword: false,
            passwordError: null,
            passwordSuccess: null,
            passwordData: { newPassword: "", confirmPassword: "" }
        };
    },

    computed: {
        ...mapState("currentUser", ["user", "profile"]),
        ...mapGetters("currentUser", ["isAuthenticated"]),
        userProfile() {
            return this.profile;
        }
    },

    created() {
    // Lade Profil automatisch beim Start
        this.checkAuthState();
    },

    methods: {
        ...mapActions("currentUser", ["checkAuthState", "updateProfile", "updatePassword"]),

        formatJoinDate(dateString) {
            if (!dateString) {return "";}
            const date = new Date(dateString);
            return date.toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" });
        },

        formatCurrency(amount) {
            return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount);
        },

        startEditingBasic() {
            this.editBasic.username = this.userProfile?.username || "";
            this.editBasic.salary = this.userProfile?.salary || null;
            this.editingBasic = true;
            this.basicError = null;
        },
        cancelEditingBasic() {
            this.editingBasic = false;
            this.basicError = null;
            this.editBasic = { username: "", salary: null };
        },
        async saveBasicInfo() {
            this.basicError = null;

            if (!this.editBasic.username.trim()) {
                this.basicError = "Benutzername ist erforderlich.";
                return;
            }
            if (this.editBasic.salary && this.editBasic.salary < 0) {
                this.basicError = "Das Gehalt muss positiv sein.";
                return;
            }

            this.loadingBasic = true;
            try {
                await this.updateProfile({
                    username: this.editBasic.username.trim(),
                    salary: this.editBasic.salary ? parseFloat(this.editBasic.salary) : null
                });
                this.editingBasic = false;
            } catch (err) {
                console.error("Fehler beim Speichern des Profils:", err);
                this.basicError = "Fehler beim Speichern. Bitte erneut versuchen.";
            } finally {
                this.loadingBasic = false;
            }
        },

        startChangingPassword() {
            this.changingPassword = true;
            this.passwordError = null;
            this.passwordSuccess = null;
            this.passwordData = { newPassword: "", confirmPassword: "" };
        },
        cancelChangingPassword() {
            this.changingPassword = false;
            this.passwordError = null;
            this.passwordSuccess = null;
            this.passwordData = { newPassword: "", confirmPassword: "" };
        },
        async changePassword() {
            this.passwordError = null;
            this.passwordSuccess = null;

            if (!this.passwordData.newPassword) {
                this.passwordError = "Neues Passwort ist erforderlich.";
                return;
            }
            if (this.passwordData.newPassword.length < 6) {
                this.passwordError = "Das Passwort muss mindestens 6 Zeichen lang sein.";
                return;
            }
            if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
                this.passwordError = "Die Passwörter stimmen nicht überein.";
                return;
            }

            this.loadingPassword = true;
            try {
                await this.updatePassword(this.passwordData.newPassword);
                this.passwordSuccess = "Passwort erfolgreich geändert!";
                setTimeout(() => this.cancelChangingPassword(), 2000);
            } catch (err) {
                console.error("Fehler beim Ändern des Passworts:", err);
                this.passwordError = "Fehler beim Ändern des Passworts. Bitte erneut versuchen.";
            } finally {
                this.loadingPassword = false;
            }
        }
    }
};
</script>

<style lang="scss">
.profile {
    margin: 36px;
    
    .login-prompt {
        text-align: center;
        padding: 60px 20px;
        
        h2 {
            color: #333;
            margin-bottom: 20px;
        }
        
        p {
            color: #666;
            font-size: 16px;
            margin-bottom: 40px;
        }
        
        &__icon {
            margin-top: 20px;
        }
    }
    
    &__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 30px;
        
        .headline {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
        
        .profile-info {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 5px;
            
            .email {
                font-weight: bold;
                color: #666;
            }
            
            .join-date {
                font-size: 14px;
                color: #888;
            }
        }
    }
    
    .profile-cards {
        display: grid;
        gap: 30px;
        max-width: 800px;
    }
    
    .profile-card {
        background: white;
        border-radius: 10px;
        padding: 25px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        border: 1px solid #e0e0e0;
        
        &.danger-card {
            border-color: #dc3545;
            background: #fff5f5;
        }
        
        h3 {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0 0 20px 0;
            color: #333;
            font-size: 18px;
            
            i {
                color: #417d41;
                
                .danger-card & {
                    color: #dc3545;
                }
            }
        }
        
        .card-content {
            &.editing {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
            }
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
            
            label {
                font-weight: bold;
                color: #333;
            }
            
            span {
                color: #666;
            }
        }
        
        .form-group {
            margin-bottom: 15px;
            
            label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
            }
            
            input {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 14px;
                
                &:focus {
                    outline: none;
                    border-color: #417d41;
                    box-shadow: 0 0 5px rgba(65, 125, 65, 0.3);
                }
                
                &:disabled {
                    background-color: #f5f5f5;
                    cursor: not-allowed;
                }
            }
        }
        
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        
        .edit-btn, .save-btn, .cancel-btn, .danger-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
            
            &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        }
        
        .edit-btn {
            background-color: #417d41;
            color: white;
            
            &:hover:not(:disabled) {
                background-color: #356635;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
        }
        
        .save-btn {
            background-color: #28a745;
            color: white;
            
            &:hover:not(:disabled) {
                background-color: #218838;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
        }
        
        .cancel-btn {
            background-color: #6c757d;
            color: white;
            
            &:hover:not(:disabled) {
                background-color: #545b62;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
        }
        .error-message {
            background-color: #fee;
            color: #c00;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 15px;
            border: 1px solid #fcc;
        }
        
        .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 15px;
            border: 1px solid #c3e6cb;
        }
    }
}
</style>