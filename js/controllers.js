app.controller("IndexController", IndexController);

function getRandomInt(min, max) {
 	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function IndexController($scope, $http) {
	$scope.userPoint = 0;
	$scope.dealerPoint = 0;
	$scope.dealerCards = [];
	$scope.userCards = [];
  	$scope.deck = [];

  	$http.get("db/deck.json").success(function(response) {
  		$scope.deck = response;
  		$scope.getCards(2, $scope.dealerCards);
		$scope.getCards(2, $scope.userCards);
  	});

	$scope.getRandomCard = function() {
		var cardIndex = getRandomInt(0, $scope.deck.length - 1);
		var colorIndex = getRandomInt(0, 3);
		return {
			"img": $scope.deck[cardIndex].img[colorIndex],
			"point": $scope.deck[cardIndex].point
		}
	}

	$scope.getCards = function(count, hand) {
		for (var i = 0; i < count; i++) {
			var cardData = $scope.getRandomCard();
			hand.push(cardData);
			if(hand == $scope.userCards){
				$scope.userPoint += cardData.point;
			} else {
				$scope.dealerPoint += cardData.point;
			}

		}
	}

	$scope.addCard = function()	{
		var cardData = $scope.getRandomCard();
		$scope.userCards.push(cardData);
		$scope.userPoint += cardData.point;
	}
}