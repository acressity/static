function verify(message, element){
	if (element){
		message = message + "\n\n" + element.value;
	}
	if (!message){
		message = 'Are you sure?';
	}
	if (confirm(message)){
		return true;
	} else {
		return false;
	}
}
