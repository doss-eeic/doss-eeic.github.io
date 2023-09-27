function n_occurrences(s, x) {
    var i = 0;
    var n = 0;
    while (true) {
	i = s.indexOf(x, i);
	if (i == -1) return n;
	i += x.length;
	n++;
    }
}

function max_n_occurrences(a, x) {
    var n = a.length;
    var max_no = 0;
    for (i = 0; i < n; i++) {
	var no = n_occurrences(a[i], x);
	if (no > max_no) max_no = no;
    }
    return max_no;
}
function show_random(a) {
    var n_lines = max_n_occurrences(a, "<br />");
    var n = a.length;
    var i = Math.floor(n * Math.random());
    if (i >= n) return i = n - 1;
    var s = a[i];
    var nbr = n_occurrences(s, "<br />");
    for (i = nbr; i < n_lines; i++) {
	s = "<br />" + s;
    }
    document.write("<i><font color=purple size=-1>" + s + "</font></i>");
}

