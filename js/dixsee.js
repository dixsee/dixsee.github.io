alphabet_set = new Set('abcdefghijklmnopqrstuvwxyz')

function show_about_splash() {
    $('#about_splash').show();
}

function hide_about_splash() {
    $('#about_splash').hide();
    $('#guess').focus();
}

function show_splash() {
    $('#splash').show();
}

function hide_splash() {
    $('#splash').hide();
    $('#guess').focus();
}

// cryptographic hash:
function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

// start a new game:
function reset() {
    // secret word:
    // exclude first and last words in the dictionary to avoid
    // edge case with left and right bounds:
    if (window.mode == 'daily') {
	var today = new Date();
	var today_str = today.toDateString();

	// pad a few times to make known prefix, etc. attacks more challenging:
	for (var i=0; i<10; ++i)
	    today_str += today_str;

	// TODO: append last S&P closing stock price to prevent future lookup
	
	var seeds = cyrb128(today_str);
	// primes:
	var i = (seeds[0]*2 + seeds[1]*3 + seeds[2]*5 + seeds[3]*5) % 100003679;

	// exclude first and last words in the dictionary to avoid
	// edge case with left and right bounds:
	var x = window.words[ i % (window.words.length-1) + 1 ];
    }
    else {
	// infinite version:
	// window.mode == 'infinite'
	var x = window.words[ Math.floor(Math.random()*(window.words.length-2))+1 ];
    }

    window.guesses = [];

    window.left = words[0];
    window.right = words[words.length-1];
    $('#left').text(window.left);
    $('#right').text(window.right);

    $('#guesses').empty();

    $('#guess').val('');

    // hide x instead of using window.x:
    partial_lt_x = function(g) {
	return g < x;
    };

    partial_levenshtein = function(g) {
	return levenshtein(g, x);
    };
    
    window.n_hints = 0;
    window.n_guesses = 0;

    $('#guess').focus();
}

// allow enter key to submit:
$("#guess").keypress(function(e) {
    // if the key pressed is the enter key
    if (e.which == 13) {
	submit();
    }
});

function levenshtein(a, b) {
    var t = [], u, i, j, m = a.length, n = b.length;
    if (!m) { return n; }
    if (!n) { return m; }
    for (j = 0; j <= n; j++) { t[j] = j; }
    for (i = 1; i <= m; i++) {
	for (u = [i], j = 1; j <= n; j++) {
	    u[j] = a[i - 1] === b[j - 1] ? t[j - 1] : Math.min(t[j - 1], t[j], u[j - 1]) + 1;
	} t = u;
    } return u[n];
}

function hint() {
    window.n_hints++;
    
    // binary search unnecessary for <100k compared to animations of submit():
    ind_left = window.words.indexOf(window.left);
    ind_right = window.words.indexOf(window.right);
    
    // exclude left and right (so -2 and shift range by +1):
    g = window.words[ ind_left + Math.floor(Math.random() * (ind_right-ind_left-2)) + 1 ];
    $('#guess').val(g);
    
    submit();
}

function is_superset(set, subset) {
    for (const elem of subset) {
	if (!set.has(elem)) {
	    return false;
	}
    }
    return true;
}

function winner() {
    $('#hint').prop('disabled',true);

    $('#score').text('Found "' + $('#guess').val() + '" in ' + window.n_guesses + ' tries & ' + window.n_hints + ' hints')

    $('#dixsee').animate({
	'color':'#0f0'
    }, 2000, complete=function(){
	$('#dixsee').animate({
	    'color':'#000'
	}, 1000, complete=function() {
	    if (window.mode == 'infinite')
		reset();
	});
    });

    setTimeout('$("#hint").removeAttr("disabled")', 3000);
}

function add_guess(g) {
    // add to count if new guess:
    if (! new Set(window.guesses).has(g) )
	window.n_guesses++;
    // add submission to list, regardless:
    window.guesses.push(g);

    var color;
    if (dist_leven == 0)
	color = '#0f0';
    else if (dist_leven == 1)
	color = '#0a0';
    else if (dist_leven == 2)
	color = '#080';
    else if (dist_leven == 3)
	color = '#070';
    else if (dist_leven == 4)
	color = '#060';
    else if (dist_leven == 5)
	color = '#050';
    else if (dist_leven == 6)
	color = '#020';
    else
	// dist_leven > 6:
	color = '#000';

    var weight;
    if (dist_leven <= 3)
	weight = 'bold';
    else
	weight = 'normal';

    $('#guesses').prepend(
	'<div class="row result" style="color:'+color+'; font-weight:' + weight + '"><div class="two columns value-prop"></div><div class="four columns value-prop"><p>'+ dist_leven +'</p></div><div class="six columns value-prop"><p>' + g + '</p></div></div>');
}    

function submit() {
    var g = $('#guess').val().toLowerCase();
    dist_leven = partial_levenshtein(g)

    if (dist_leven == 0) {
	add_guess(g);

	winner();
    }
    else {
	if (window.words_set.has(g)) {
	    if (g > window.left && g < window.right) {
		// guess splits range:
		if (partial_lt_x(g)) {
		    window.left = g;
		    $('#left').text(window.left);
		}
		else {
		    // g > x:
		    window.right = g;
		    $('#right').text(window.right);
		}
	    }

	    add_guess(g);

	    // clear guess:
	    $('#guess').val('');
	}
	else {
	    // not a valid word:
	    $('#guess').animate({
		'background-color':'#f00'
	    }, 250, complete=function(){
		$('#guess').animate({
		    'background-color':'#fff'
		}, 10);
	    });
	}
    }

    // restore focus to #guess after mouse click for submission/hint:
    $('#guess').focus();
}

// download the dictionary and start the game.
// NOTE: doesn't work locally; for that, use raw link to github file american-english.
// FIXME:
//fetch('./media/american-english')
fetch('https://raw.githubusercontent.com/dixsee/dixsee.github.io/main/media/american-english')
    .then(response => response.text())
    .then((words_file) => {
	// clean out punctuation, etc.:
	words = words_file.split('\n').filter( w => w.length>0 && is_superset(alphabet_set, new Set(w)) );
	// already sorted:
	//words.sort();
	
	window.words = words;
	window.words_set = new Set(words);

	reset();

	if (document.cookie == '') {
	    $('#splash').show();
	    document.cookie = 'visited';
	}
    });
