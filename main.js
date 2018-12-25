//Main game script
//Requires card.js and deck.js to be loaded beforehand in that order

//Document areas
var statusArea = document.getElementById('status');
var dealerHandArea = document.getElementById('dealerHand');
var playerHandArea = document.getElementById('playerHand');

//Document buttons
var hitButton = document.getElementById('hitButton');
var newGameButton = document.getElementById('newGameButton');
var standButton = document.getElementById('standButton');

//Game variables
var deck = new Deck();
var dealerHand = new Deck();
var playerHand = new Deck();

function addStatus(text)
{
	console.log(text);
	statusArea.innerHTML = statusArea.innerHTML + divSurround(text);
}

//The dealer takes his turn then the game ends. Should be called after the player busts or stands
function dealerTurn()
{
	addStatus("Dealer's turn");
	//If dealer score is < 17 hit. Soft 17s not implemented
	let dealerScore = scoreDeck(dealerHand);
	while (dealerScore < 17)
	{
		let drawCard = deck.pop();
		dealerHand.push(drawCard);
		dealerScore = scoreDeck(dealerHand);
		addStatus('Dealer draws ' + drawCard.fullName());
		showDealerHand();
	}
	
	let dealerBusted = false;
	if (dealerScore > 21)
	{
		addStatus('Dealer busted');
		dealerBusted = true;
	}
	else
		addStatus('Dealer stands');
	
	//End game
	let playerScore = scoreDeck(playerHand);
	let playerBusted = false;
	if (playerScore > 21)
		playerBusted = true;
	if (dealerBusted && playerBusted)
		addStatus('Push');
	else if (dealerBusted && !playerBusted)
		addStatus('Player wins!');
	else if (!dealerBusted && playerBusted)
		addStatus('Dealer wins!');
	else //No one busts
	{
		if (dealerScore === playerScore)
			addStatus('Push');
		else if (dealerScore >  playerScore)
			addStatus('Dealer wins!');
		else
			addStatus('Player wins!');
	}
	
	hideButton(hitButton);
	hideButton(standButton);
	showButton(newGameButton);
}

function divSurround(str)
{
	return '<div>' + str + '</div>';
}

function hideButton(b)
{
	b.style.display = 'none';
}

function hitEvent()
{
	addStatus('Player hits');
	playerHand.push(deck.pop());
	showPlayerHand();
	let score = scoreDeck(playerHand);
	if (score > 21)
	{
		addStatus('Player busted');
		dealerTurn();
	}
}

function resetGame()
{
	//Reset decks
	deck.makeStandardDeck();
	deck.shuffle();
	dealerHand.clear();
	playerHand.clear();
	
	//Initial deal
	dealerHand.push(deck.pop());
	dealerHand.push(deck.pop());
	playerHand.push(deck.pop());
	playerHand.push(deck.pop());
	
	//Update UI
	setStatus('New game!');
	showDealerHand();
	showPlayerHand();
	addStatus("Player's turn");
	hideButton(newGameButton);
	showButton(hitButton);
	showButton(standButton);
}

function scoreDeck(deck)
{
	let aceCount = 0;
	let score = 0;
	for (let i = 0; i < deck.length(); ++i)
	{
		let card = deck.get(i);
		score += card.value;
		if (card.isAce())
			++aceCount;
	}
	while (score <= 11 && aceCount > 0)
	{
		score += 10;
		aceCount -= 1;
	}
	return score;
}

function setStatus(text)
{
	console.log(text);
	statusArea.innerHTML = divSurround(text);
}

function showButton(b)
{
	b.style.display = 'inline-block';
}

function showDealerHand()
{
	let cards = dealerHand.fullNameList().map(divSurround);
	let score = divSurround('Score: ' + scoreDeck(dealerHand));
	dealerHandArea.innerHTML = cards.join('') + score;
}

function showPlayerHand()
{
	let cards = playerHand.fullNameList().map(divSurround);
	let score = divSurround('Score: ' + scoreDeck(playerHand));
	playerHandArea.innerHTML = cards.join('') + score;
}

function standEvent()
{
	addStatus('Player stands');
	dealerTurn();
}

//Event listeners
hitButton.addEventListener('click', hitEvent);
newGameButton.addEventListener('click', resetGame);
standButton.addEventListener('click', standEvent);

//Call resetGame for initial setup
resetGame();
