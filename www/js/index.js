var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        window.QRScanner.prepare(onDone); // show the prompt
        document.querySelector("#scan").addEventListener("touchend", function() {
            window.QRScanner.scan(displayContents);
        });
        function onDone(err, status){
            if (err) {
                console.error(err);
            }
            if (status.authorized) {
				window.QRScanner.show();
            } else if (status.denied) {
				$('.loader').fadeOut();
				alert('Please Authorize App to Access Camera.');
				QRScanner.openSettings();
            } else {
				alert('Please Authorize App to Access Camera.');
				QRScanner.openSettings();
            }
        }

        function displayContents(err, text){
            if(err){
                alert('Please Authorize App to Access Camera.');
				QRScanner.openSettings();
			} else {
				$('.loader').fadeIn();
				$.ajax({
					url: 'http://beta.cores2020.com/assets/api.php?data='+text, 
					type: 'get',
					error: function(err){
						$('.loader').fadeOut();
						alert("Please check if you have internet connection.\n");
					},
					success: function(data, status){
						data = JSON.parse(data);
						$('.loader').fadeOut();
						if(data['message'] != 'success'){
							alert('User is not Registered!');
						}else{
							msg = data['fname']+' '+data['lname'] + '\n\n';
							var isStart = false;
							isWorkshop = isSeminar = false;
							var isset = false;
							for(var key in data){
								if(isStart){
									if(key.length == 5 && !isWorkshop){
										msg += 'Workshop:\n';
										isWorkshop = true;
										isSeminar = false;
									}else if(key.length !=5 && !isSeminar){
										msg += 'Seminar:\n';
										isSeminar = true;
									}
									if(isSeminar || isWorkshop){
										if(isWorkshop){
											msg += '  ' + key + ' : ' + data[key] + '\n';
										}else if(isSeminar && data['allpass'] == true && !isset){
											msg += '  5th YEAR PASS\n';
											isset = true;
										}else if(isSeminar && data['allpass'] == true && isset){
											
										}else if(isSeminar){
											msg += '  ' + key + ' : ' + data[key] + '\n';
										}
									}
								}
								if(key == 'message'){
									isStart = true;
								}
							}
							alert(msg);							
						}
					}
				});
            }
        }
    },
    receivedEvent: function(id) {
//        alert('Received Event: ' + id);
    }
};
$('.loader').fadeOut();
app.initialize();
