<?php
// Konfigurace databáze
$host = "localhost";
$username = "root";
$password = "root";
$database = "ZLKL_sample_db";

// Připojení k databázi
$conn = new mysqli($host, $username, $password, $database);

// Kontrola připojení
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Kontrola, zda byla použita metoda POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Získání čísla řádku z POST dat
    $rowNumber = $_POST["rowNumber"];

    // Inicializace proměnných pro odpověď
    $response = array();

    // Kontrola, zda číslo řádku je platné celé číslo a zda je v povoleném rozsahu
    if (!filter_var($rowNumber, FILTER_VALIDATE_INT) || $rowNumber < 1 || $rowNumber > 100) {
        $response["ok"] = false;
        $response["err"] = "Hodnota textového pole ($rowNumber) není platné číslo v rozmezí od 1 do 100.";
    } else {
        // Spuštění jediné SQL dotazu pro načtení vybraného řádku
        $sql = "SELECT ID, Jméno, Přijmení, Rok_narození FROM seznam_uživatelů WHERE ID = $rowNumber";

        // Provedení SQL dotazu
        $result = $conn->query($sql);

        // Kontrola, zda byly vráceny nějaké řádky
        if ($result && $result->num_rows > 0) {
            // Načtení řádku
            $row = $result->fetch_assoc();
            $response["ok"] = true;
            $response["err"] = "";
            $response["data"] = $row;
        } else {
            $response["ok"] = false;
            $response["err"] = "Nebyla nalezena žádná data pro tento řádek $rowNumber";
        }
    }

    // Výstup odpovědi ve formátu JSON
    echo json_encode($response);
}

// Ukončení připojení
$conn->close();
?>
