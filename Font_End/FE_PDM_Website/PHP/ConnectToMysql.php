<?php 
try{
    $dbh = new PDO("mysql:host=$hostname;dbname=mysql",$username, $password);
    echo "Connected to database<br />";
    $sql = "SELECT * FROM animals";
    foreach($dbh -> query($sql) as $row){
        print $row('animal_type').'-'.$row['animal_name'] . '<br />';
    }  
    $dbh = null;  
}
catch (PDOException $e){
    echo $e -> getMessage();
}
?>