// ==UserScript==
// @name         PhoneWorx
// @namespace    https://gist.githubusercontent.com/nealey/3af026cc34ddf502419aa16eee3a4caa/
// @version      0.4
// @description  Subtly change Feisworks for narrow screens
// @author       Neale Pickett <neale@woozle.org>
// @match        http*://*.feisworx.com/*
// @match        http*://feisworx.com/*
// @grant        none
// ==/UserScript==

// jshint asi:true

// Most of what we're doing here is trying to make content flow.
// Quite a lot of pages are set up to do this pretty well already,
// they just need some hints removed.

var foneworxCss = `
body {
  background: rgb(127,216,192);
  background: linear-gradient(0deg, #1fc6f4 0%, #7fd8c0 100%);
}

#foneworx-contact p {
  float: right;
  padding: 0 1em;
  font-size: small;
}

#foneworx-logo {
  font-family: 'Uncial Antiqua', cursive;
  font-size: 1.5em;
}
#foneworx-logo a:link {
  text-decoration: none;
  color: black;
}

@media (max-width: 768px) {
  body {
    margin: 0;
  }
  h1, h2, h3, p {
    margin: 0.5em;
  }
  #foneworx-title h1 {
    margin: 0em 0.5em;
  }
  body > table:nth-of-type(1) tr {
    display: flex;
    flex-wrap: wrap;
  }
  #foneworx-nav tr {
    display: flex;
  }
  a.sel {
    padding: 0.5em;
    margin: 0.1em;
  }
  form > table:nth-of-type(1) tr {
    display: flex;
    flex-wrap: wrap;
  }
  form > table:nth-of-type(1) td {
    display: block;
  }
}
`

var foneworxNotice = `
<hr>

<p>
FoneWorx is an unofficial wrapper around FeisWorx.
We have reached out to the FeisWorx people
about integrating this functionality,
and remain hopeful that something like this can make it to the
official site.
</p>

<p>
If you have problems with FoneWorx,
try the <a href="https://www.feisworx.com/">FeisWorx Site</a>
instead.
</p>

<p>
  <a href="mailto:neale@woozle.org">FoneWorx Contact</a>
  |
  <a href="https://github.com/nealey/foneworx">Source</a>
<p>
`

function foneworxTag(path, id) {
  let e = document.querySelector(path)
  if (e) {
    e.id = id
  }
}

function foneworxInit() {
    let viewport = document.createElement("meta")
    viewport.name = "viewport"
    viewport.content = "width=device-width, initial-scale=1"
    document.head.appendChild(viewport)
    
    let fontlink = document.createElement("link")
    fontlink.href="https://fonts.googleapis.com/css?family=Uncial+Antiqua&display=swap"
    fontlink.rel="stylesheet"
    document.head.appendChild(fontlink)

    // Remove forced width on anything that forces it
    for (let e of document.querySelectorAll("[width]")) {
        e.width = undefined
    }

    // Tag some things to make CSS more readable
    foneworxTag("body > table:first-child [align='left']", "foneworx-logo")
    foneworxTag("body > table:first-child [align='center']", "foneworx-title")
    foneworxTag("body > table:first-child [align='right']", "foneworx-contact")
    foneworxTag("table[align='center']", "foneworx-nav")

    // Do a lot of things to prevent people from pestering FeisWorx.
    // If you are the FeisWorx people, I would love to
    // give you whatever support you need to integrate this code,
    // absolutely free of charge. neale@woozle.org
    
    // Change out the logo so it's clear this isn't FeisWorx
    let logo = document.querySelector("#foneworx-logo")
    if (logo) {
      logo.innerHTML = "<a href='/'>FoneWorx</a>"
    }
  
    // Tamper heavily with "contact us"
    // so the feisworx people don't get a ton of mail
    // about something they didn't make.
    let contact = document.querySelector("#foneworx-contact")
    if (contact) {
      // Move it to the bottom
      document.querySelector(".copyright").insertAdjacentElement("beforebegin", contact)
      contact.innerHTML = foneworxNotice
    }

    let style = document.createElement("style")
    style.textContent = foneworxCss
    document.head.appendChild(style)
}


if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", foneworxInit)
} else {
  foneworxInit()
}
