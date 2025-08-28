$(function () {
    // -------------------- Date Picker --------------------
    $('#datePicker').daterangepicker({
        autoUpdateInput: false,
        autoApply: true,
        minDate: moment(),
        opens: "center",
        drops: "up",
        locale: { format: 'YYYY-MM-DD' }
    });

    $('#datePicker').on('apply.daterangepicker', function (ev, picker) {
        // Raw data (old format)
        let raw = picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD');
        $(this).attr("data", raw);

        // Pretty display
        let pretty = picker.startDate.format('MMM D') + ' - ' + picker.endDate.format('MMM D');
        $(this).val(pretty);
    });

    // -------------------- Guest Selector --------------------
    let adults = 0;
    let children = 0;

    $('#guestInput').on('click', function () {
        $('#guestDropdown').toggle();
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.guest-wrapper').length) {
            $('#guestDropdown').hide();
        }
    });

    function updateInput() {
        if (adults === 0 && children === 0) {
            $('#guestInput').val('');
            $('#guestInput').attr("data", "");
            return;
        }

        // Pretty display
        let text = [];
        if (adults > 0) text.push(adults + " adults");
        if (children > 0) text.push(children + " children");
        $('#guestInput').val(text.join(", "));

        // Raw data
        let raw = [];
        if (adults > 0) raw.push(adults + " Adult" + (adults > 1 ? "s" : ""));
        if (children > 0) {
            let ages = [];
            $('#childrenAges select').each(function () {
                ages.push("Age " + $(this).val());
            });
            raw.push(children + " Child" + (children > 1 ? "ren" : "") + " (" + ages.join(", ") + ")");
        }
        $('#guestInput').attr("data", raw.join(", "));
    }

    $('.plus').on('click', function () {
        let type = $(this).data('type');
        if (type === 'adult') { adults++; $('#adultCount').text(adults); }
        else { children++; $('#childCount').text(children); $('#childrenAges').append(makeChildAge(children)); }
        updateInput();
    });

    $('.minus').on('click', function () {
        let type = $(this).data('type');
        if (type === 'adult' && adults > 0) { adults--; $('#adultCount').text(adults); }
        if (type === 'child' && children > 0) { $('#childrenAges .child-age:last').remove(); children--; $('#childCount').text(children); }
        updateInput();
    });

    function makeChildAge(n) {
        let html = '<div class="child-age"><label>Child ' + n + ' age:</label><select>';
        for (let i = 0; i <= 12; i++) { html += '<option value="' + i + '">' + i + '</option>'; }
        html += '</select></div>';
        return html;
    }

    $('#childrenAges').on('change', 'select', function () { updateInput(); });

    updateInput();
});

// -------------------- Submit --------------------
function submit() {
    let dateRaw = $('#datePicker').attr("data");
    let guestRaw = $('#guestInput').attr("data");

    console.log("RAW Dates:", dateRaw);
    console.log("RAW Guests:", guestRaw);

    let link = "https://alyasavillage.bookingmystay.com/";
    let adults = parseInt($('#adultCount').text(), 10) || 0;
    let children = parseInt($('#childCount').text(), 10) || 0;

    if (dateRaw) {
        link += "?checkin=" + dateRaw.split(" - ")[0];
        if (dateRaw.split(" - ").length > 1) {
            link += "&checkout=" + dateRaw.split(" - ")[1];
        }
    }
    if (guestRaw) {
        link += (dateRaw ? "&" : "?") + "adults=" + adults + "&children=" + children;
        if (children > 0) {
            let ages = [];
            $('#childrenAges select').each(function (i, sel) {
                ages.push($(sel).val());
            });
            link += "&ages=" + ages.join("_");
        }
    }

    console.log("Generated Link:", link);
    window.open(link, '_blank');
}