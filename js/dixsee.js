// GNU Free Documentation License 1.3 due to use of Rosetta Code's
// Levenshtein distance implementation (others could be used instead)

window.mode = 'daily';
$("#subtitle_and_toggle_infinite").hide();
$('#button_copy').hide();
alphabet_set = new Set('abcdefghijklmnopqrstuvwxyz')

$('#button_copy').prop('title','COPY RESULTS TO CLIPBOARD');

set_letter_count = () => {
    $("#guess_letter_count").text($('#guess').val().length);
}

$('#guess').keyup( () => {
    set_letter_count();
});

toggle_mode = () => {
    if (window.mode == 'daily') {
	// change to infinite mode:
	window.mode = 'infinite';

	$("#subtitle_and_toggle_daily").hide();
	$("#subtitle_and_toggle_infinite").show();

	$('#guess').prop('disabled', false);
	$('#button_submit').prop('disabled', false);
	$('#button_hint').prop('disabled', false);

	$('#guess').prop('placeholder', 'Guess!');
    }
    else {
	// window.mode == 'infinite'

	window.mode = 'daily';

	$("#subtitle_and_toggle_infinite").hide();
	$("#subtitle_and_toggle_daily").show();

	$('#guesses').empty();
    }

    $('#button_copy').hide();
    $('#score').text('');

    reset();
}

show_about_splash = () => {
    $('#about_splash').show();
}

hide_about_splash = () => {
    $('#about_splash').hide();
    $('#guess').focus();
}

show_splash = () => {
    $('#splash').show();
}

hide_splash = () => {
    $('#splash').hide();
    $('#guess').focus();
}

// cryptographic hash via
// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
cyrb128 = (str) => {
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

// rejoin an existing daily game:
restore_if_game_in_progress = () => {
    if (String(localStorage.data_daily_game_json) != 'undefined') {
	window.data_daily_game = JSON.parse(localStorage.data_daily_game_json);

	if (window.data_daily_game.date == new Date().toDateString()) {
	    // add the guesses to the page:
	    window.data_daily_game.guesses.forEach((g)=>{
		var dist_leven = partial_levenshtein(g);
		add_guess_to_page(g, dist_leven);
		if (dist_leven == 0)
		    winner(g);
	    });
	}
	else
	    // saved game is from a different date:
	    new_game_state();
    }
    else
	// no saved game to restore:
	new_game_state();
}

save_game_if_mode_is_daily = () => {
    if (window.mode == 'daily')
	localStorage.data_daily_game_json = JSON.stringify(window.data_daily_game);
}

new_game_state = () => {
    window.data_daily_game = {"guesses":[],
			      "left":words[0],
			      "right":words[words.length-1],
			      "date":new Date().toDateString()
			     }

    $('#guesses').empty();

    window.data_daily_game.n_hints = 0;
    window.data_daily_game.n_guesses_unique = 0;

    save_game_if_mode_is_daily();
}

// start a new game or restore existing (if mode is daily and game is in progress):
reset = () => {
    var today_str = new Date().toDateString();

    if (window.mode == 'daily')
	$('#date_today').text(today_str.toUpperCase());

    // choose x, the secret word:

    // exclude first and last words in the dictionary to avoid
    // edge case with left and right bounds.

    if (window.mode == 'daily') {
	// pad a few times to make known prefix, etc. attacks more challenging:
	var today_str_extended = today_str;
	for (var i=0; i<10; ++i)
	    today_str_extended = today_str_extended + today_str_extended;

	// TODO: salt by appending to last S&P closing stock price to prevent future lookup ;)
	
	var seeds = cyrb128(today_str);
	// primes, where 100003679 exceeds dictionary size:
	var i = (seeds[0]*2 + seeds[1]*3 + seeds[2]*5 + seeds[3]*5) % 100003679;

	var x = window.words[ i % (window.words.length-1) + 1 ];
    }
    else
	// infinite version:
	// window.mode == 'infinite'
	var x = window.words[ Math.floor(Math.random()*(window.words.length-2))+1 ];

    // hide x instead of using window.x:
    partial_lt_x = (g) => {
	return g < x;
    };

    partial_levenshtein = (g) => {
	return levenshtein(g, x);
    };
    
    if (window.mode == 'daily')
	restore_if_game_in_progress();
    else
	new_game_state();

    // set cookie to today:
    document.cookie = today_str;

    $('#left').text(window.data_daily_game.left);
    $('#right').text(window.data_daily_game.right);

    $('#guess').val('');
    set_letter_count();

    $('#guess').focus();
}

// allow enter key to submit:
$("#guess").keypress((e) => {
    // if the key pressed is the enter key
    if (e.which == 13) {
	submit();
    }
});

// levenshtein distance via
// https://rosettacode.org/wiki/Levenshtein_distance#JavaScript
levenshtein = (a, b) => {
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

hint = () => {
    window.data_daily_game.n_hints++;
    
    // binary search unnecessary for <100k compared to animations of submit():
    ind_left = window.words.indexOf(window.data_daily_game.left);
    ind_right = window.words.indexOf(window.data_daily_game.right);
    
    // exclude left and right (so -2 and shift range by +1):
    g = window.words[ ind_left + Math.floor(Math.random() * (ind_right-ind_left-2)) + 1 ];
    $('#guess').val(g);
    
    submit();
}

is_superset = (set, subset) => {
    for (const elem of subset) {
	if (!set.has(elem)) {
	    return false;
	}
    }
    return true;
}

winner = (guess) => {
    // when playing daily, disable new entries into guess text box:
    if (window.mode == 'daily') {
	$('#guess').prop('disabled', true);
	$('#guess').val('');
	set_letter_count();
	$('#guess').prop('placeholder', 'See you tomorrow!');
    }
    
    $('#button_submit').prop('disabled',true);
    $('#button_hint').prop('disabled',true);

    $('#score').text('Found "' + guess + '" in ' + window.data_daily_game.n_guesses_unique + ' tries & ' + window.data_daily_game.n_hints + ' hints')

    // record mode before animation, in case user switches modes
    // during animation:
    var mode = window.mode;

    $('#dixsee').animate({
	'color':'#0f0'
    }, 2000, complete=()=>{
	$('#dixsee').animate({
	    'color':'#000'
	}, 1000, complete=()=>{
	    if (mode == 'infinite')
		// start a new game:
		reset();
	});
    });

    if (mode == 'infinite') {
	setTimeout('$("#button_submit").removeAttr("disabled")', 3000);
	setTimeout('$("#button_hint").removeAttr("disabled")', 3000);
    }
    $('#button_copy').show();
}

add_guess_to_game_data_and_page = (g, dist_leven) => {
    // add to count if new guess:
    if (! new Set(window.data_daily_game.guesses).has(g) )
	window.data_daily_game.n_guesses_unique++;
    // add submission to list, regardless:
    window.data_daily_game.guesses.push(g);

    add_guess_to_page(g, dist_leven);
}

add_guess_to_page = (g, dist_leven) => {
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
	'<div class="row result" style="color:'+color+'; font-weight:' + weight + '"><div class="two columns value-prop"></div><div class="four columns value-prop"><p>'+ dist_leven +'</p></div><div class="six columns value-prop"><p class="existing_guess">' + g + '</p></div></div>');
    var guess_new = $('.existing_guess').first();
    guess_new.prop('title', String(g.length)+' letters');
}    

submit = () => {
    var g = $('#guess').val().toLowerCase();
    var dist_leven = partial_levenshtein(g)

    if (dist_leven == 0) {
	add_guess_to_game_data_and_page(g, dist_leven);
	winner( $('#guess').val() );
    }
    else {
	if (window.words_set.has(g)) {
	    if (g > window.data_daily_game.left && g < window.data_daily_game.right) {
		// guess splits range:
		if (partial_lt_x(g)) {
		    window.data_daily_game.left = g;
		    $('#left').text(window.data_daily_game.left);
		}
		else {
		    // g > x:
		    window.data_daily_game.right = g;
		    $('#right').text(window.data_daily_game.right);
		}
	    }

	    add_guess_to_game_data_and_page(g, dist_leven);

	    // clear guess:
	    $('#guess').val('');
	    set_letter_count();
	}
	else {
	    // not a valid word:
	    $('#guess').animate({
		'background-color':'#f00'
	    }, 250, complete=()=>{
		$('#guess').animate({
		    'background-color':'#fff'
		}, 10);
	    });
	}
    }

    // restore focus to #guess after mouse click for submission/hint:
    $('#guess').focus();

    save_game_if_mode_is_daily();
}

copy_score_to_clipboard = () => {
    var name_game = 'DIXSEE!'
    // remove secret word:
    var puzzle_id = $('#subtitles_and_toggles').children(":visible").text().replace(/ SWITCH TO.*/, '');
    var score = $('#score').text();
    if (window.mode == 'daily')
	// hide secret word for sharing:
	score = score.replace(/\".*\"/,'SECRET_WORD')
    var text_to_copy = name_game + '\n' + puzzle_id + '\n' + score;

    navigator.clipboard.writeText(text_to_copy);

    $('#copy_splash').show(0, complete=()=>{
	$('#copy_splash').hide(1000);
    });
}

// download the dictionary and start the game.
// NOTE: doesn't work locally; for that, use raw link to github file american-english.
fetch('./media/american-english')
//fetch('https://raw.githubusercontent.com/dixsee/dixsee.github.io/main/media/american-english')
    .then(response => response.text())
    .then((words_file) => {
	// clean out punctuation, etc.:
	words = words_file.split('\n').filter( w => w.length>0 && is_superset(alphabet_set, new Set(w)) );
	// already sorted:
	//words.sort();
	
	window.words = words;
	window.words_set = new Set(words);

	if (document.cookie == '')
	    // new visitor; show splash screen with directions:
	    // cookie will be set in reset()
	    $('#splash').show();

	reset();
    });
