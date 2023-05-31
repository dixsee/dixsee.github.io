//var init = function() {

// Gratuitous use of "\n"+ required because some browsers (e.g., older
// Android) don't support backticks `...` for multiline string literals.

// Load mountains:
mountains = document.getElementById("mountains");
if (mountains != null) {
mountains.innerHTML = "<section class='header' style='margin-bottom:0;'>\n"+
"      <div style='margin:0; padding:0;'>\n"+
"<b><pre class='asciiart'>\n"+
"\n"+
"                      /\\\n"+
"                     /  \\                  /\\\n"+
"                    /    \\     /\\         /  \\\n"+
"           /\\      /\\/\\/\\/\\   /  \\       /\\/\\/\\\n"+
"          /  \\    /        \\ /\\/\\/\\    _/      \\\n"+
"        _/\\/\\/\\  /      /\\  /      \\  /         \\\n"+
"      _/       \\/      /  \\/        \\/           \\\n"+
"     /          \\__   /   /          \\_           \\\n"+
"    /              \\_/_  /             \\           \\\n"+
"   /                   \\/               \\           \\\n"+
"\n"+
"\n"+
"       █████╗ ██╗     ██████╗ ██╗███╗   ██╗███████╗  \n"+
"      ██╔══██╗██║     ██╔══██╗██║████╗  ██║██╔════╝  \n"+
"      ███████║██║     ██████╔╝██║██╔██╗ ██║█████╗    \n"+
"      ██╔══██║██║     ██╔═══╝ ██║██║╚██╗██║██╔══╝    \n"+
"      ██║  ██║███████╗██║     ██║██║ ╚████║███████╗  \n"+
"      ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═══╝╚══════╝  \n"+
"                                                  \n"+
"       █████╗ ██╗      ██████╗  ██████╗ ██████╗ ██╗  \n"+
"      ██╔══██╗██║     ██╔════╝ ██╔═══██╗██╔══██╗██║  \n"+
"      ███████║██║     ██║  ███╗██║   ██║██████╔╝██║  \n"+
"      ██╔══██║██║     ██║   ██║██║   ██║██╔══██╗██║  \n"+
"      ██║  ██║███████╗╚██████╔╝╚██████╔╝██║  ██║██║  \n"+
"      ╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  \n"+
"                                                   \n"+
"    ████████╗██╗  ██╗███╗   ███╗██╗ ██████╗███████╗\n"+
"    ╚══██╔══╝██║  ██║████╗ ████║██║██╔════╝██╔════╝\n"+
"       ██║   ███████║██╔████╔██║██║██║     ███████╗\n"+
"       ██║   ██╔══██║██║╚██╔╝██║██║██║     ╚════██║\n"+
"       ██║   ██║  ██║██║ ╚═╝ ██║██║╚██████╗███████║\n"+
"       ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝ ╚═════╝╚══════╝\n"+
"                                                   \n"+
"\n"+
"</pre></b>\n"+
"<div style='text-align:left; width:auto; margin:0;'>\n"+
"  <p style='line-height:1;'><b>\n"+
"    &nbsp;&nbsp;ALGORITHMS &gt; NUMERICS &gt; MACHINE LEARNING &gt; COMP BIO\n"+
"  </p>\n"+
"</div>\n"+
"      </div>\n"+
"    </section>";
}

// Load footer:
document.getElementById("footer").innerHTML = "<div><p>© 2023, ALL RIGHTS RESERVED</p></div>";

// Set up two-fade:
var faders = document.querySelectorAll('.two-fade');
for (var i=0; i<faders.length; ++i) {
  var fader = faders[i];

  var initial_display = fader.querySelector(':nth-child(1)').style.display;

  fader.addEventListener('mouseover', function(){
    this.querySelector(':nth-child(1)').style.display='none';
    this.querySelector(':nth-child(2)').style.display=initial_display;
  });

  fader.addEventListener('mouseout', function(){
    this.querySelector(':nth-child(1)').style.display=initial_display;
    this.querySelector(':nth-child(2)').style.display='none';
  });
}

// end of init
//}

