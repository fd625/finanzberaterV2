<template>
    <div class="profile">
        <div v-if="!user" class="login-prompt">
            <h2>Profil</h2>
            <p>Bitte melden Sie sich an, um Ihr Profil zu bearbeiten.</p>
            <div class="login-prompt__icon">
                <i class="pi pi-user" style="font-size: 4rem; color: #ccc;"></i>
            </div>
        </div>
        
        <div v-else class="profile-content">
            <div class="profile__header">
                <div class="headline">Mein Profil</div>
                <div class="profile-info">
                    <span class="email">{{ user.email }}</span>
                    <span class="join-date">Mitglied seit: {{ formatJoinDate }}</span>
                </div>
            </div>
            
            <div class="profile-cards">
                <!-- Basic Information Card -->
                <div class="profile-card">
                    <h3>
                        <i class="pi pi-user"></i>
                        Grundinformationen
                    </h3>
                    
                    <div v-if="!editingBasic" class="card-content">
                        <div class="info-row">
                            <label>Benutzername:</label>
                            <span>{{ userProfile?.username || 'Nicht gesetzt' }}</span>
                        </div>
                        <div class="info-row">
                            <label>Gehalt:</label>
                            <span>{{ formattedSalary }}</span>
                        </div>
                        <button class="edit-btn" @click="startEditingBasic">
                            <i class="pi pi-pencil"></i> Bearbeiten
                        </button>
                    </div>
                    
                    <div v-else class="card-content editing">
                        <div v-if="basicError" class="error-message">
                            {{ basicError }}
                        </div>
                        
                        <div class="form-group">
                            <label>Benutzername:</label>
                            <input 
                                v-model="editBasic.username" 
                                type="text" 
                                placeholder="Ihr Benutzername"
                                :disabled="loadingBasic"
                            />
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
                            />
                        </div>
                        
                        <div class="button-group">
                            <button 
                                class="save-btn" 
                                @click="handleSaveBasicInfo" 
                                :disabled="loadingBasic">
                                <i class="pi pi-check"></i> 
                                {{ loadingBasic ? 'Speichert...' : 'Speichern' }}
                            </button>
                            <button 
                                class="cancel-btn" 
                                @click="cancelEditingBasic"
                                :disabled="loadingBasic">
                                <i class="pi pi-times"></i> Abbrechen
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Password Change Card -->
                <div class="profile-card">
                    <h3>
                        <i class="pi pi-lock"></i>
                        Passwort ändern
                    </h3>
                    
                    <div v-if="!changingPassword" class="card-content">
                        <p>Sie können hier ein neues Passwort festlegen.</p>
                        <button class="edit-btn" @click="startChangingPassword">
                            <i class="pi pi-key"></i> Passwort ändern
                        </button>
                    </div>
                    
                    <div v-else class="card-content editing">
                        <div v-if="passwordError" class="error-message">
                            {{ passwordError }}
                        </div>
                        
                        <div v-if="passwordSuccess" class="success-message">
                            {{ passwordSuccess }}
                        </div>
                        
                        <div class="form-group">
                            <label>Neues Passwort:</label>
                            <input 
                                v-model="passwordData.newPassword" 
                                type="password" 
                                placeholder="Mindestens 6 Zeichen"
                                :disabled="loadingPassword"
                            />
                        </div>
                        <div class="form-group">
                            <label>Passwort bestätigen:</label>
                            <input 
                                v-model="passwordData.confirmPassword" 
                                type="password" 
                                placeholder="Passwort wiederholen"
                                :disabled="loadingPassword"
                            />
                        </div>
                        
                        <div class="button-group">
                            <button 
                                class="save-btn" 
                                @click="handleChangePassword" 
                                :disabled="loadingPassword">
                                <i class="pi pi-check"></i> 
                                {{ loadingPassword ? 'Ändert...' : 'Passwort ändern' }}
                            </button>
                            <button 
                                class="cancel-btn" 
                                @click="cancelChangingPassword"
                                :disabled="loadingPassword">
                                <i class="pi pi-times"></i> Abbrechen
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// Import services
import { profileService } from '../services/profileService';
import { authService } from '../services/authService';
import { formatUtils } from '../utils/formatUtils';

export default {
    name: 'Profile',
    props: {
        user: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            userProfile: null,
            
            // Basic info editing state
            editingBasic: false,
            loadingBasic: false,
            basicError: null,
            editBasic: {
                username: '',
                salary: null
            },
            
            // Password change state
            changingPassword: false,
            loadingPassword: false,
            passwordError: null,
            passwordSuccess: null,
            passwordData: {
                newPassword: '',
                confirmPassword: ''
            }
        }
    },
    computed: {
        formatJoinDate() {
            return formatUtils.formatLongDate(this.user?.created_at);
        },
        formattedSalary() {
            return this.userProfile?.salary 
                ? formatUtils.formatCurrency(this.userProfile.salary) 
                : 'Nicht gesetzt';
        }
    },
    watch: {
        user: {
            handler(newUser) {
                if (newUser) {
                    this.loadUserProfile();
                } else {
                    this.userProfile = null;
                }
            },
            immediate: true
        }
    },
    methods: {
        async loadUserProfile() {
            if (!this.user) return;
            
            try {
                this.userProfile = await profileService.getProfileById(this.user.id);
            } catch (error) {
                console.error('Error loading profile:', error);
            }
        },
        
        // Basic info editing methods
        startEditingBasic() {
            this.editBasic.username = this.userProfile?.username || '';
            this.editBasic.salary = this.userProfile?.salary || null;
            this.editingBasic = true;
            this.basicError = null;
        },
        
        cancelEditingBasic() {
            this.editingBasic = false;
            this.basicError = null;
            this.editBasic = { username: '', salary: null };
        },
        
        async handleSaveBasicInfo() {
            this.basicError = null;
            
            // Validate username
            const usernameValidation = profileService.validateUsername(this.editBasic.username);
            if (!usernameValidation.valid) {
                this.basicError = usernameValidation.error;
                return;
            }
            
            // Validate salary
            const salaryValidation = profileService.validateSalary(this.editBasic.salary);
            if (!salaryValidation.valid) {
                this.basicError = salaryValidation.error;
                return;
            }
            
            this.loadingBasic = true;
            
            try {
                const updateData = {
                    username: this.editBasic.username.trim(),
                    salary: formatUtils.parseCurrencyInput(this.editBasic.salary)
                };
                
                this.userProfile = await profileService.updateProfile(this.user.id, updateData);
                this.editingBasic = false;
                
            } catch (error) {
                console.error('Error updating profile:', error);
                this.basicError = error.message || 'Fehler beim Speichern. Versuchen Sie es erneut.';
            } finally {
                this.loadingBasic = false;
            }
        },
        
        // Password change methods
        startChangingPassword() {
            this.changingPassword = true;
            this.passwordError = null;
            this.passwordSuccess = null;
            this.passwordData = { newPassword: '', confirmPassword: '' };
        },
        
        cancelChangingPassword() {
            this.changingPassword = false;
            this.passwordError = null;
            this.passwordSuccess = null;
            this.passwordData = { newPassword: '', confirmPassword: '' };
        },
        
        async handleChangePassword() {
            this.passwordError = null;
            this.passwordSuccess = null;
            
            // Validate password
            const validation = authService.validatePassword(
                this.passwordData.newPassword, 
                this.passwordData.confirmPassword
            );
            
            if (!validation.valid) {
                this.passwordError = validation.error;
                return;
            }
            
            this.loadingPassword = true;
            
            try {
                await authService.changePassword(this.passwordData.newPassword);
                this.passwordSuccess = 'Passwort erfolgreich geändert!';
                
                setTimeout(() => {
                    this.cancelChangingPassword();
                }, 2000);
                
            } catch (error) {
                console.error('Error changing password:', error);
                this.passwordError = error.message || 'Fehler beim Ändern des Passworts.';
            } finally {
                this.loadingPassword = false;
            }
        }
    }
}
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
        
        h3 {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0 0 20px 0;
            color: #333;
            font-size: 18px;
            
            i {
                color: #417d41;
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
        
        .edit-btn, .save-btn, .cancel-btn {
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