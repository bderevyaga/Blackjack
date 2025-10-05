app.controller('IndexController', IndexController);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Інтелект ділера
function dealerAI(min, max, point) {
    const ai = getRandomInt(min, max);

    return ai < (21 - point);
}

function IndexController($scope, $http) {
    let gameStatus = true;
    if (!localStorage.getItem('userMoney')) {
        localStorage.setItem('userMoney', '100');
    }
    $scope.userMoney = localStorage.getItem('userMoney');
    // Поставити гроші
    $scope.addMoney = function () {
        if (gameStatus) {
            if ($scope.userMoney > 0) {
                $scope.userMoney -= 10;
                $scope.userAnte += 10;
            }
            localStorage.setItem('userMoney', $scope.userMoney);
        }
    };
    // Нова гра
    $scope.newGame = function () {
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
        localStorage.setItem('userMoney', $scope.userMoney);

        $http.get('db/deck.json').success(function (response) {
            $scope.deck = response;
            $scope.userPoint = $scope.getCards(2, $scope.userCards);
            $scope.dealerPoint = $scope.getCards(2, $scope.dealerCards);
        });
    };

    $scope.newGame();
    // Береться з колоди рандомна карта
    $scope.getRandomCard = function () {
        const cardIndex = getRandomInt(0, $scope.deck.length - 1);
        const colorIndex = getRandomInt(0, $scope.deck[cardIndex].img.length - 1);
        const card = {
            'img': $scope.deck[cardIndex].img[colorIndex],
            'point': $scope.deck[cardIndex].point
        };

        $scope.deck[cardIndex].img.splice(colorIndex, 1);
        if ($scope.deck[cardIndex].img.length === 0) {
            $scope.deck.splice(cardIndex, 1);
        }
        return card;
    };
    // Видається декілька карт
    $scope.getCards = function (count, hand) {
        let pointSum = 0;
        for (let i = 0; i < count; i++) {
            const cardData = $scope.getRandomCard();
            hand.push(cardData);
            pointSum += cardData.point;
        }
        return pointSum;
    };
    // Користувач бере карту
    $scope.addCard = function () {
        if (gameStatus) {
            const cardData = $scope.getRandomCard();
            $scope.userCards.push(cardData);
            $scope.userPoint += cardData.point;
            if ($scope.userPoint > 21) {
                $scope.endGame();
            }
        } else {
            $scope.newGame();
        }
    };
    // Ділер бере карту
    $scope.addDealerCard = function () {
        if ($scope.dealerPoint > 10) {
            const aiStatus = dealerAI(2, 11, $scope.dealerPoint);
            if (!aiStatus) {
                return false;
            }
        }
        const cardData = $scope.getRandomCard();
        $scope.dealerCards.push(cardData);
        $scope.dealerPoint += cardData.point;
        return true;
    };
    // Ділер набирає карти, відкрити карти і вивисти результат гри
    $scope.endGame = function () {
        let status = true;
        if (gameStatus) {
            gameStatus = false;
            $scope.openDealerCards = true;
            while (status) {
                status = $scope.addDealerCard();
            }
            if ($scope.userPoint > 21 && $scope.dealerPoint > 21 || $scope.userPoint === $scope.dealerPoint) {
                $scope.status = 'Нічя';
                $scope.userMoney += $scope.userAnte;
            } else if ($scope.userPoint > $scope.dealerPoint && $scope.userPoint <= 21 || $scope.dealerPoint > 21) {
                $scope.status = 'Ви виграли!';
                $scope.userMoney += ($scope.userAnte * 2);
            } else {
                $scope.status = 'Дилер виграв';
            }
            localStorage.setItem('userMoney', $scope.userMoney);
        }
    };
}