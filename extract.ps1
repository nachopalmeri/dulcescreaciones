# Extract CSS from lines 14-179 (0-indexed: 13..178)
$lines = Get-Content 'dulces_creaciones_v2.html' -Encoding UTF8
$cssLines = $lines[13..178]
$cssContent = $cssLines -join "`n"

# Add hamburger menu CSS for mobile
$mobileNavCSS = @"

/* HAMBURGER MENU */
.hamburger{display:none;background:none;border:none;cursor:pointer;padding:.5rem;z-index:101;}
.hamburger span{display:block;width:24px;height:2px;background:var(--choco);margin:5px 0;transition:all .3s;}
.hamburger.active span:nth-child(1){transform:rotate(45deg) translate(5px,5px);}
.hamburger.active span:nth-child(2){opacity:0;}
.hamburger.active span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px);}
@media(max-width:768px){
  .hamburger{display:block;}
  .nav-links{
    position:fixed;top:0;right:-100%;width:70%;max-width:320px;height:100vh;
    flex-direction:column;background:var(--crema);padding:5rem 2rem 2rem;
    gap:1.5rem;transition:right .4s ease;box-shadow:-4px 0 24px rgba(92,51,23,.1);
    z-index:100;display:flex;
  }
  .nav-links.open{right:0;}
  .nav-links a{font-size:.95rem;}
}
"@

$cssContent = $cssContent + $mobileNavCSS
Set-Content -Path 'styles.css' -Value $cssContent -Encoding UTF8
Write-Host "styles.css created successfully"

# Create scripts.js
$jsContent = @"
/* Dulces Creaciones - Main Scripts */

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

// Scroll reveal animation
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

// Marquee duplicate for seamless loop
const marqueeInner = document.querySelector('.marquee-inner');
if (marqueeInner) {
  marqueeInner.innerHTML += marqueeInner.innerHTML;
}
"@

Set-Content -Path 'scripts.js' -Value $jsContent -Encoding UTF8
Write-Host "scripts.js created successfully"

Write-Host "Done! Now create index.html manually."
