<?php
//Konfigurace databáze
$host = "localhost";
$username = "root";
$password = "root";
$database = "ZLKL_sample_db";

// Připojení k databázi
$conn = new mysqli($host, $username, $password, $database);

//Kontrola připojení
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//Check jestli je request POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //Get číslo řádku z POST dat
    $rowNumber = $_POST["rowNumber"];
    
    if ($rowNumber > 100) {
        echo json_encode(array("error" => "Hodnota textového pole: ($rowNumber) přesahuje povolený limit."));
    } else {
        //SQL query pro fetch vybraneho řádku z tabulky "seznam_uživatelů"
        $sql = "SELECT ID, Jméno, Přijmení, Rok_narození FROM seznam_uživatelů WHERE ID = ?";
        
        //Příprava SQL dotazu
        $stmt = $conn->prepare($sql);
        
        //Bind parametr
        $stmt->bind_param("i", $rowNumber); // "i" pro integer
        
        // Execute the statement
        $stmt->execute();
        
        //Get výsledek
        $result = $stmt->get_result();
        
        //Kontrola zda byl nějaký řádek vrácen
        if ($result->num_rows > 0) {
            //Fetch řádek
            $row = $result->fetch_assoc();
            //Output řádku v JSON formátu
            echo json_encode($row);
        } else {
            echo json_encode(array("error" => "Nebyla nalezena žádná data pro tento řádek $rowNumber"));
        }
    }
}

//Ukončí připojení
$conn->close();
?>
