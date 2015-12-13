app.controller("IndexController", IndexController);

function getRandomInt(min, max) {
 	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function dealerAI(min, max, point) {
 	var ai = getRandomInt(min, max);
 	if(ai >= ( 21 - point )){
 		return false;
 	}
 	return true;
}
function IndexController($scope, $http) {
	$scope.newGame = function()	{
		$scope.userPoint = 0;
		$scope.dealerPoint = 0;
		$scope.dealerCards = [];
		$scope.userCards = [];
		$scope.openDealerCards = false;
	  	$scope.deck = [];

	  	$http.get("db/deck.json").success(function(response) {
	  		$scope.deck = response;
	  		$scope.userPoint = $scope.getCards(2, $scope.userCards);
	  		$scope.dealerPoint = $scope.getCards(2, $scope.dealerCards);
	  	});
	}
	
	$scope.newGame();

	$scope.getRandomCard = function() {
		if($scope.deck.length == 0){
			return null;
		}
		var cardIndex = getRandomInt(0, $scope.deck.length - 1);
		var colorIndex = getRandomInt(0, $scope.deck[cardIndex].img.length - 1);
		var card = {
			"img": $scope.deck[cardIndex].img[colorIndex],
			"point": $scope.deck[cardIndex].point,
		};

		$scope.deck[cardIndex].img.splice(colorIndex, 1);
		if($scope.deck[cardIndex].img.length == 0){
			$scope.deck.splice(cardIndex, 1);
		}
		return card;
	}

	$scope.getCards = function(count, hand) {
		var pointSumm = 0;
		for (var i = 0; i < count; i++) {
			var cardData = $scope.getRandomCard();
			if(cardData){
				hand.push(cardData);
				pointSumm += cardData.point;
			}
		}
		return pointSumm;
	}

	$scope.addCard = function()	{
		var cardData = $scope.getRandomCard();
		if(cardData){
			$scope.userCards.push(cardData);
			$scope.userPoint += cardData.point;
		}else{
			$scope.status = "Карти закончились";
		}
	}

	$scope.addDealerCard = function()	{
		if($scope.dealerPoint > 10){
			var aiStatus = dealerAI(2, 11, $scope.dealerPoint);
			if(!aiStatus){
				return false;
			}
		}
		var cardData = $scope.getRandomCard();
		if(cardData){
			$scope.dealerCards.push(cardData);
			$scope.dealerPoint += cardData.point;
			return true;
		}else{
			$scope.status = "Карти закончились";
			return false;
		}
	}

	$scope.endGame = function()	{
		var status = true;

		$scope.openDealerCards = true;

		while(status){
			status = $scope.addDealerCard();
		}
		if($scope.userPoint > 21 && $scope.dealerPoint > 21 || $scope.userPoint == $scope.dealerPoint){
			$scope.status = "Ничя";
			return false;
		}
		if($scope.userPoint > $scope.dealerPoint && $scope.userPoint <= 21 || $scope.dealerPoint > 21){
			$scope.status = "Вы виграли";
		}else{
			$scope.status = "Дилер вииграл";		
		}
	}
}