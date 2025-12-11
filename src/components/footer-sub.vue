<template>
  <footer class="app-footer">
    <div class="footer-content">
      <!-- Link-Bereich -->
      <div class="footer-section">
        <h3>Informationen</h3>
        <ul>
          <li>
            <RouterLink to="/Impressum">
              Impressum
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/DatenSchutz">
              Datenschutz
            </RouterLink>
          </li>
          <li>
            <a href="/agb">AGB</a>
          </li>
          <li>
            <RouterLink to="/FAQ">
              FAQ
            </RouterLink>
          </li>
          <li>
            <a href="/kontakt">Kontakt</a>
          </li>
        </ul>
      </div>
  
      <!-- Support -->
      <div class="footer-section">
        <h3>Support</h3>
        <ul>
          <li><a href="/hilfe">Hilfe & Support</a></li>
          <li><a href="/feedback">Feedback</a></li>
          <li><a href="/sicherheit">Sicherheit</a></li>
        </ul>
      </div>
  
      <!-- Social Media -->
      <div class="footer-section">
        <h3>Folge uns</h3>
        <div class="socials">
          <a href="#"><i class="fab fa-instagram" /></a>
          <a href="#"><i class="fab fa-twitter" /></a>
          <a href="#"><i class="fab fa-facebook" /></a>
        </div>
      </div>
    </div>
  
    <div class="footer-bottom">
      <p>© {{ new Date().getFullYear() }} DeineSparApp – Alle Rechte vorbehalten.</p>
    </div>
  </footer>
</template>
  
<script>
export default {
    name: "AppFooter"
};
</script>
  
  <style scoped>
  .app-footer {
    background: #001b42;
    color: #eaeaea;
    padding: 40px 20px 20px;
    margin-top: 40px;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .footer-section h3 {
    margin-bottom: 10px;
    font-size: 18px;
    color: #fff;
  }
  
  .footer-section ul {
    list-style: none;
    padding: 0;
  }
  
  .footer-section ul li {
    margin: 6px 0;
  }
  
  .footer-section ul li a {
    color: #dcdcdc;
    text-decoration: none;
    transition: 0.2s;
  }
  
  .footer-section ul li a:hover {
    color: #4facfe;
  }
  
  .socials a {
    color: #dcdcdc;
    font-size: 20px;
    margin-right: 10px;
    transition: 0.2s;
  }
  
  .socials a:hover {
    color: #4facfe;
  }
  
  .footer-bottom {
    text-align: center;
    margin-top: 30px;
    font-size: 14px;
    color: #9b9b9b;
  }
  </style>
  