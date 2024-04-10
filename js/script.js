$(document).ready(function() {
    // handleButtonClick funkce. Omezuje textové pole od 1 do 100
    function handleButtonClick() {
        var rowNumber = $('#rowNumber').val(); // Získá hodnotu z textového pole

        // Kontrola zda je hodnota z textového pole mezi 1 a 100
        if (!/^(100|\d{1,2})$/.test(String(rowNumber))) {
            // Zobrazí popup zprávu
            alert("Zadejte číslo mezi 1 a 100");

            // Změní hodnotu textového pole na nejbližší možné číslo - cokoliv nad 100 změní na 100
            $('#rowNumber').val(Math.min(Math.max(parseInt(rowNumber), 1), 100));

            // Return to prevent further processing
            return;
        }

        // AJAX request
        $.ajax({
            url: '../index.php',
            type: 'POST',
            data: { rowNumber: rowNumber },   // Předá hodnotu z textového pole do PHP skriptu
            dataType: 'json',  // Očekává JSON odpověď
            success: function(response) {
                console.log(response);  // Zaloguje JSON odpověď do konzole
                // Vymaže předchozí výsledek
                $('#result').empty();

                // Kontrola, zda je odpověď úspěšná
                if (response.ok ?? false) {
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
                console.error(error); // Zaloguje jakékoli chyby do konzole
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
    });
});
