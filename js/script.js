$(document).ready(function() {
    // handleButtonClick funkce. Omezuje textové pole od 1 do 100
    function handleButtonClick() {
        var rowNumber = $('#rowNumber').val(); // Získá hodnotu z textového pole

        //Kontrola zda je hodnota z textového pole mezi 1 a 100
        if (rowNumber < 1 || rowNumber > 100) {
            //Zobrazí popup zprávu
            alert("Limit textového pole je mezi 1 a 100");

            //Změní hodnotu textového pole na nejbližší možné číslo - cokoliv nad 100 změní na 100
            $('#rowNumber').val(Math.min(Math.max(parseInt(rowNumber), 1), 100));

            // Return to prevent further processing
            return;
        }

        // AJAX request
        $.ajax({
            url: '../index.php',
            type: 'POST',
            data: { rowNumber: rowNumber },   //Předá hodnotu textového pole do PHP skriptu
            dataType: 'json',  //Očekává data ve formátu JSON
            success: function(response) {
                console.log(response);  //Hodnota odpověďi ve formátu JSON v console logu
                //Vymaže předchozí výsledek
                $('#result').empty();

                //Bootstrap karta na zobrazení dat
                var card = $('<div class="card">');
                var cardBody = $('<div class="card-body">');
                var title = $('<h5 class="card-title">').text('User Data');
                var list = $('<ul class="list-group list-group-flush">');

                //Loop přes data a přidá je do listu
                $.each(response, function(key, value) {
                    var listItem = $('<li class="list-group-item">').text(key + ': ' + value);
                    list.append(listItem);
                });
                
                //Přidá data do bootstrap karty
                cardBody.append(title);
                cardBody.append(list);
                card.append(cardBody);

                //Append kartu do výsledného divu s ID result
                $('#result').append(card);
            },
            error: function(xhr, status, error) {
                console.error(error);  //Zobrazí errory v consoli
            }
        });
    }

    //Event listener pro click tlačítka
    $('#testButton').click(handleButtonClick);

    //Event listener pokud se zmáčkne enter
    $('#rowNumber').keypress(function(event) {
        if (event.which === 13) { // Check if Enter key was pressed
            event.preventDefault(); // Prevent default form submission
            handleButtonClick(); // Call the function to handle button click
        }
    })});