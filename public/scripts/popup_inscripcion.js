document.getElementById('ins').addEventListener('submit', function (event) {
    event.preventDefault(); 
    document.getElementById('popup').style.display = 'block';

    setTimeout(function() {
        document.getElementById('popup').style.display = 'none';
        document.getElementById('ins').submit();
    }, 3000);
});