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
	var gameStatus = true;
	$scope.userMoney = 100;
	$scope.addMoney = function(){
		if(gameStatus){
			if($scope.userMoney > 0){
				$scope.userMoney -= 10;
				$scope.userAnte += 10;
			}
		}
	}
	$scope.newGame = function()	{
		gameStatus = true;
		$scope.openDealerCards = false;
		$scope.userAnte = 0;
		$scope.userPoint = 0;
		$scope.dealerPoint = 0;
		$scope.dealerCards = [];
		$scope.userCards = [];
	  	$scope.deck = [];
	  	$scope.userMoney -= 10;
		$scope.userAnte += 10;

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
		if(gameStatus){
			var cardData = $scope.getRandomCard();
			if(cardData){
				$scope.userCards.push(cardData);
				$scope.userPoint += cardData.point;
				if($scope.userPoint > 21){
					$scope.endGame();
				}
			}
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
			$scope.status = "Карти закінчились";
			return false;
		}
	}

	$scope.endGame = function()	{
		var status = true;
		if(gameStatus){
			gameStatus = false;
			$scope.openDealerCards = true;
			while(status){
				status = $scope.addDealerCard();
			}
			if($scope.userPoint > 21 && $scope.dealerPoint > 21 || $scope.userPoint == $scope.dealerPoint){
				$scope.status = "Нічя";
				$scope.userMoney += $scope.userAnte;	
			}else if($scope.userPoint > $scope.dealerPoint && $scope.userPoint <= 21 || $scope.dealerPoint > 21){
				$scope.status = "Ви виграли";
				$scope.userMoney += ($scope.userAnte * 2);	
			}else{
				$scope.status = "Ділер вииграл";		
			}
		}
	}
}