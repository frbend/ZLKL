$(document).ready(function() {
    // Funkce handleButtonClick. Omezuje textové pole od 1 do 100
    function handleButtonClick() {
        var rowNumber = $('#rowNumber').val(); // Získá hodnotu z textového pole

        // Kontrola zda je hodnota z textového pole mezi 1 a 100
        if (rowNumber < 1 || rowNumber > 100) {
            // Zobrazí popup zprávu
            alert("Limit textového pole je mezi 1 a 100");

            //Změní hodnotu textového pole na nejbližší možné číslo - cokoliv nad 100 změní na 100
            $('#rowNumber').val(Math.min(Math.max(parseInt(rowNumber), 1), 100));

            // Return pro zabránění dalšího zpracování
            return;
        }

        // AJAX požadavek
        $.ajax({
            url: '../index.php',
            type: 'POST',
            data: { rowNumber: rowNumber },   // Předá hodnotu z textového pole do PHP skriptu
            dataType: 'json',  // Očekává JSON data jako odpověď
            success: function(response) {
                console.log(response);  //Hodnota odpověďi ve formátu JSON v console logu
                //Vymaže předchozí výsledek
                $('#result').empty();
                // Kontrola, zda je odpověď úspěšná
                if (response.ok) {
                    // Vytvoření Bootstrap karty pro zobrazení dat
                    var card = $('<div class="card">');
                    var cardBody = $('<div class="card-body">');
                    var title = $('<h5 class="card-title">').text('Uživatelská data');
                    var list = $('<ul class="list-group list-group-flush">');

                    // Procházení dat v odpovědi a jejich přidání do seznamu
                    $.each(response.data, function(key, value) {
                        var listItem = $('<li class="list-group-item">').text(key + ': ' + value);
                        list.append(listItem);
                    });

                    // Přidání prvků do těla karty
                    cardBody.append(title);
                    cardBody.append(list);

                    // Přidání těla karty do karty
                    card.append(cardBody);

                    // Přidání karty do výsledného divu s ID result
                    $('#result').append(card);
                } else {
                    // Zobrazení chybové zprávy
                    $('#result').text(response.err);
                }
            },
            error: function(xhr, status, error) {
                console.error(error);  //Zobrazí errory v consoli
            }
        });
    }

    // Event listener pro kliknutí na tlačítko
    $('#testButton').click(handleButtonClick);

    // Event listener pro stisknutí klávesy Enter
    $('#rowNumber').keypress(function(event) {
        if (event.which === 13) { // Kontrola, zda byla stisknuta klávesa Enter
            event.preventDefault(); // Zabránění výchozímu odeslání formuláře
            handleButtonClick(); // Zavolání funkce pro zpracování kliknutí na tlačítko
        }
    })});