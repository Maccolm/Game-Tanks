
// Задача 5. Байрактар.З верхньої частини екрану у випадковій позиції по горизонталі з’являються танки, які їдуть вниз.При кліку на танк він вибухає і зникає з екрану. 
//Рендер танку
class Tank {
	static counterPreviousRecord = 0
	static counterMissingVehicles = 0
	static counterDestroitVehicles = 0
	static maxToMiss = 5
	//контейнери з каунтерами
	static destroitVehicleContainer = document.querySelector('.counter__destroit')
	static missingVehicleContainer = document.querySelector('.counter__missing')
	static previousRecordContainer = document.querySelector('.counter__previous-record')
//таймер шввидкості
	static changeSpeed = 0
	static SpeedTimerId = null
	
	constructor(styleType) {
		this.styleType = styleType
		this.positionDownImg = './img/tank/tank.png'
		this.positionLeftImg = './img/tank/tank-left.png'
		this.positionRightImg = './img/tank/tank-right.png'
		this.currentPositionTop
		this.currentPositionLeft
		this.targetContainer = document.getElementById('container')
		this.explosionImages = [
			'./img/explosion/1.png',
			'./img/explosion/2.png',
			'./img/explosion/3.png',
			'./img/explosion/4.png',
			'./img/explosion/5.png',
			'./img/explosion/6.png',
			'./img/explosion/7.png',
			'./img/explosion/8.png',
			'./img/explosion/9.png'
		]
		this.currentExplosioIndex = 0  //Індекс поточного зображення вибуху
		this.animationId
		this.timer
		
		this.targetDestroitVehicle = 30
		this.playAgain = false
	}
	getContainerId(containerId) {
	return this.targetContainer = containerId
	}
	getRandomPosition() {
		return Math.floor(Math.random() * (90 - 1) + 1)
	}
	getRanNumSeconds(minV, maxV) {
		return Math.floor(Math.random() * (maxV - minV) + minV)
	}
	//Таймер для продовження руху техніки
	renderVehicle() {
		this.vehicle = document.createElement('div')
		this.vehicle.className = 'vehicle'
		this.vehicle.style.left = this.getRandomPosition() + '%'
		this.vehicle.style.top = '-50px'
		// this.vehicle.classList.remove('destroitVehicle')

		this.vehicleImg = document.createElement('img')
		this.vehicleImg.src = this.positionDownImg
		this.vehicleImg.alt = 'vehicle Image'
		this.vehicleImg.className = 'vehicle-img'

		//Тінь для танку або техніки
		this.shadow = document.createElement('div')
		this.shadow.className = this.styleType === 'tank' ? 'shadow-tank' : 'shadow'
		//вихлопні гази для танку
		this.exhaust = document.createElement('div')
		this.exhaust.className = 'exhaust'
		this.smoke = document.createElement('div')
		this.smoke.className = 'exhaust-smoke'
		const img = document.createElement('img')
		const img2 = document.createElement('img')
		img.src = './img/smoke.svg'
		img2.src = './img/smoke.svg'
		img.alt = 'exhaust'
		img2.alt = 'smoke'
		this.exhaust.append(img)
		this.smoke.append(img2)

		this.vehicle.append(this.vehicleImg)
		this.vehicle.append(this.shadow)
		this.vehicle.append(this.exhaust)
		this.vehicle.append(this.smoke)
		this.tankPositionLeft = this.vehicle.offsetLeft
		this.targetContainer.append(this.vehicle)

		this.vehicle.onmousedown = () => {
			const explosionAudio = new Audio('./audio/vzryiv-i-ogon-na-meste-vzryiva.mp3')
			explosionAudio.play()
			cancelAnimationFrame(this.animationId);
			clearTimeout(this.timer);
			this.destroitVehicle();
		}
		return this.vehicle
	}
	// animationPulse(){
	// 	let curretnSizeHeight = parseInt(this.vehicle.offsetHeight)
	// 	let curretnSizeWidth = parseInt(this.vehicle.offsetWidth)

	// 	const animationSpeed = 1
	// const increase = () =>{
	// 	curretnSizeHeight += animationSpeed
	// 	curretnSizeWidth += animationSpeed
	// 	this.vehicle.style.height = curretnSizeHeight + 'px'
	// 	this.vehicle.style.width = curretnSizeWidth + 'px'
	// 	if(curretnSizeHeight < 140){
	// 		requestAnimationFrame(increase())
	// 	} else {
	// 		decrease()
	// 	}
	// }

	// 	const decrease = () =>{
	// 		curretnSizeHeight -= animationSpeed
	// 		curretnSizeWidth -= animationSpeed
	// 		this.vehicle.style.height = curretnSizeHeight + 'px'
	// 		this.vehicle.style.width = curretnSizeWidth + 'px'
	// 		if(curretnSizeHeight >= 140){
	// 			requestAnimationFrame(decrease())
	// 		} else {
	// 			increase()
	// 		}
	// 	}	
	// 		increase()
	// }
	// 	// requestAnimationFrame(() => this.animationPulse())
	// // }
	movingDown(height, width) { //задати умову, якщо це танк
		this.containerWidth = width
		this.currentPositionTop = this.vehicle.offsetTop //Додаю висоту техніки, щоб вона не зміщалася при повороті
		this.containerHeight = height
		this.vehicle.style.height = '133px'
		this.vehicle.style.width = '50px'

		this.vehicle.className = 'vehicle'
		this.shadow.className = this.styleType === 'tank' ? 'shadow-tank' : 'shadow'
		this.exhaust.className = 'exhaust'
		this.smoke.className = 'exhaust-smoke'

		this.vehicleImg.src = this.positionDownImg
		this.moveDown()
	}
	moveDown() {
		switch (this.styleType) {
			case 'btr':
				this.speed = 1.5 + Tank.changeSpeed
				break;
			case 'car':
				this.speed = 2 + Tank.changeSpeed
				break;
			case 'tank':
				this.speed = 1 + Tank.changeSpeed
				break;
			}
			console.log(this.speed);
		const animate = () => {
			
			if (this.currentPositionTop < this.containerHeight) {
				this.currentPositionTop += this.speed
				this.vehicle.style.top = this.currentPositionTop + 'px'
				this.animationId = requestAnimationFrame(animate)
			} else {
				cancelAnimationFrame(this.animationId)
				clearTimeout(this.timer)
				this.vehicle.style.top = '-70px'
				this.vehicle.style.left = this.getRandomPosition() + '%'
				Tank.counterMissingVehicles++
				Tank.missingVehicleContainer.innerHTML = ''
				Tank.missingVehicleContainer.innerHTML = `Missing: ${Tank.counterMissingVehicles}`
				this.movingDown(this.containerHeight, this.containerWidth)
				//Якщо програв, приймамемо рішення продовження гри
				if (Tank.counterMissingVehicles > Tank.maxToMiss) {
					this.playAgain = confirm(`Your result ${Tank.counterDestroitVehicles} destroyed enemy vehicles. Do you want to play agan?`)
					this.playAgain ? this.stop() : this.showResults()
					Tank.clearInterval()
					Tank.changeSpeed = 0
				}
			}
		}
		const randomSeconds = this.getRanNumSeconds(1, 3)

		this.timer = setTimeout(() => {
			cancelAnimationFrame(this.animationId)
			clearTimeout(this.timer)
			this.handleRandomTurn()
			//вибираємо поворот вправо або вліво

		}, randomSeconds * 1000)

		animate()
	}
	//Зміна стилю техніки
	movingLeft(height, width) {
		this.containerHeight = height
		this.containerWidth = width
		this.currentPositionLeft = this.vehicle.offsetLeft
		this.currentPositionTop = this.vehicle.offsetTop
		this.vehicle.style.height = '50px'
		this.vehicle.style.width = '133px'

		this.vehicle.className = 'vehicleLeft'
		this.shadow.className = this.styleType === 'tank' ? 'shadow-left-tank' : 'shadow-left'
		this.exhaust.className = 'exhaust-left'
		this.smoke.className = 'exhaust-smoke-left'

		this.vehicleImg.src = this.positionLeftImg
		this.moveLeft(this.containerHeight)
	}
	//Переміщення техніки по полю
	moveLeft() {
		switch (this.styleType) {
			case 'btr':
				this.speed = 1.5 + Tank.changeSpeed
				break;
			case 'car':
				this.speed = 2 + Tank.changeSpeed
				break;
			case 'tank':
				this.speed = 1 + Tank.changeSpeed
				break;
		}
		const leftEdge = 5
		const animate = () => {
			if (this.currentPositionLeft > leftEdge) {
				this.currentPositionLeft -= this.speed
				this.vehicle.style.left = this.currentPositionLeft + 'px'
				this.animationId = requestAnimationFrame(animate)
			} else {
				this.vehicle.style.left = leftEdge + 'px'
				cancelAnimationFrame(this.animationId)
				//зберігаємо параметри та передаємо в іншу функцію
				clearTimeout(this.timer)
				this.turnDown()
			}
		}
		const timerSeconds = this.getRanNumSeconds(1, 3)
		 this.timer = setTimeout(() => {
			cancelAnimationFrame(this.animationId)
			clearTimeout(this.timer)
			this.turnDown()
		}, timerSeconds * 1000)
		animate()
	}
	movingRight(height, width) {
		//приймаємо позицію техніки і поля
		this.containerHeight = height
		this.containerWidth = width
		this.currentPositionTop = this.vehicle.offsetTop
		this.currentPositionLeft = this.vehicle.offsetLeft

		this.vehicle.style.height = '50px'
		this.vehicle.style.width = '133px'
		this.vehicle.className = 'vehicleRight'
		this.shadow.className = this.styleType === 'tank' ? 'shadow-right-tank' : 'shadow-right'
		this.exhaust.className = 'exhaust-right'
		this.smoke.className = 'exhaust-smoke-right'

		this.vehicleImg.src = this.positionRightImg
		this.moveRight()
	}
	moveRight() {
		switch (this.styleType) {
			case 'btr':
				this.speed = 1.5 + Tank.changeSpeed
				break;
			case 'car':
				this.speed = 2 + Tank.changeSpeed
				break;
			case 'tank':
				this.speed = 1 + Tank.changeSpeed
				break;
		}
		const rightEdge = this.containerWidth - 138 // 138 - ширина техніки, щоб не виходила за край
		// const startTime = performance.now()
		const animate = () => {
			if (this.currentPositionLeft < rightEdge) {
				this.currentPositionLeft += this.speed
				this.vehicle.style.left = this.currentPositionLeft + 'px'
				this.animationId = requestAnimationFrame(animate)
			} else {
				cancelAnimationFrame(this.animationId)
				clearTimeout(this.timer)
				this.turnDown()
			}
		}
		const timerSeconds = this.getRanNumSeconds(1, 3)
		this.timer = setTimeout(() => {
			cancelAnimationFrame(this.animationId)
			clearTimeout(this.timer)
			this.turnDown()
		}, timerSeconds * 1000)

		animate()
	}
	handleRandomTurn() {
		const randomTurn = this.getRanNumSeconds(1, 3)
		if (randomTurn === 1) {
			this.movingLeft(this.containerHeight, this.containerWidth)
		} else if (randomTurn === 2) {
			this.movingRight(this.containerHeight, this.containerWidth)
		} else {
			this.movingDown(this.containerHeight, this.containerWidth)
		}
	}
	turnDown() {
		this.movingDown(this.containerHeight, this.containerWidth)
	}
	//знищення техніки
	destroitVehicle(){
		// Створюю елемент вибуху
		const explosion = document.createElement('img')
		const currentExplosion = this.explosionImages[this.currentExplosioIndex]
		explosion.src = currentExplosion
		const vehicleWidth = this.vehicle.offsetWidth
		if(this.styleType === 'tank'){
			explosion.className = 'explosion'
		} else {
			explosion.className = 'explosion-other'
		}
		
		if(vehicleWidth > 100){explosion.classList.add('explosion-left')}
		
		const explode = (index) =>{
			if(index < this.explosionImages.length){
				explosion.src = this.explosionImages[index]
				const rect = this.vehicle.getBoundingClientRect()
				explosion.style.top = rect.top + 'px'
				explosion.style.left = rect.left + 'px'
				this.targetContainer.append(explosion)

				setTimeout(()=>{
					explode(index + 1)
				},100)
			} else {
				this.explotionAnimationEnd(explosion)
			}
		}
		this.vehicle.classList.add('destroitVehicle')
		this.exhaust.remove()
		this.smoke.remove()

		explode(0)
		
		Tank.counterDestroitVehicles++
		Tank.destroitVehicleContainer.innerHTML = ''
		Tank.destroitVehicleContainer.innerHTML = `Destroyed: ${Tank.counterDestroitVehicles}`
	}
	explotionAnimationEnd(explotion){
		explotion.remove()
		setTimeout(()=>{
			this.vehicle.style.opacity = 0
			this.vehicle.remove()
			this.renderVehicle()
			this.movingDown(this.containerHeight, this.containerWidth)
		},2000)
	if (Tank.counterDestroitVehicles === this.targetDestroitVehicle) alert(`Good Result ${Tank.counterDestroitVehicles}, Don\'t give up!`)
	}
	stop(){
		Tank.missingVehicleContainer.innerHTML = ''
		Tank.destroitVehicleContainer.innerHTML = ''
		Tank.missingVehicleContainer.innerHTML = 'Missing: 0'
		Tank.destroitVehicleContainer.innerHTML = 'Destroyed: 0'
		Game.stop()
	}
	showResults(){
		Game.vehicles.forEach(vehicle => {
			cancelAnimationFrame(vehicle.animationId)
			clearTimeout(vehicle.timer)
		})
		Tank.clearInterval()
		const result = document.querySelector('.results__container')
		const results = document.querySelector('.results__title')
		results.innerHTML = `Destroyed enemies: ${Tank.counterDestroitVehicles}`
		result.classList.add('on')

	}
	//Запускаємо заново після згоди користувача
	resetGame() {
		this.movingDown(this.containerHeight, this.containerWidth)
		Tank.SpeedTimer(10)
	}
	static SpeedTimer(time){
		if(this.SpeedTimerId === null) {
			this.SpeedTimerId = setInterval(() => {
				this.changeSpeed += 0.3
			}, time * 1000)
		}
	}
	static clearInterval(){
		if(!this.SpeedTimerId === null) {
			clearInterval(this.SpeedTimerId)
			this.SpeedTimerId = null
			this.changeSpeed = 0
		}
	}
}
class Car extends Tank {
	constructor(styleType) {
		super('./img/car/car.png')
		this.styleType = styleType
		this.positionDownImg = './img/car/car.png'
		this.positionLeftImg = './img/car/car-left.png'
		this.positionRightImg = './img/car/car-right.png'
	}
}
class Btr extends Tank {
	constructor(styleType) {
		super('./img/btr/btr.png')
		this.styleType = styleType
		this.positionDownImg = './img/btr/btr.png'
		this.positionLeftImg = './img/btr/btr-left.png'
		this.positionRightImg = './img/btr/btr-right.png'
	}
}
class Game {
	static vehicles = []
	constructor(vehicleClass, styleType) {
		this.vehicle = new vehicleClass(styleType)
		this.styleType = styleType
		console.log(Game.vehicles);
	}
	addVehicleToArray(){
		let vehicle = this.vehicle
		Game.vehicles.push(vehicle)
	}
	movingDown(height, width) {
		this.vehicle.movingDown(height, width)
	}
	movingLeft(height, width) {
		this.vehicle.movingLeft(height, width)
	}
	movingRight(height, width) {
		this.vehicle.movingRight(height, width)
	}

	start() {
		Tank.SpeedTimer(10)
		this.movingDown(this.containerHeight, this.containerWidth)
		this.vehicle.getContainerId(this.targetContainer)
	}
 static stop(){
	 //добавити попередній рекорд
	 Tank.counterPreviousRecord = Tank.counterDestroitVehicles
	 Tank.counterDestroitVehicles = 0
	 Tank.counterMissingVehicles = 0
	 Tank.previousRecordContainer.innerHTML = `Previous record: ${Tank.counterPreviousRecord}`


	 Game.vehicles.forEach(vehicle => {
		 cancelAnimationFrame(vehicle.animationId)
		 clearTimeout(vehicle.timer)
		 vehicle.vehicle.style.top = '-150px'
		 vehicle.resetGame()
	 })
	}
	render(containerId) {
		this.targetContainer = document.getElementById(containerId)
		this.containerWidth = this.targetContainer.offsetWidth
		this.containerHeight = this.targetContainer.offsetHeight
		
		
		const tank = this.vehicle.renderVehicle()
		this.addVehicleToArray()
		this.start()
	}
}
//styleType: 'tank', 'car', 'btr'
window.onload = function () {
	let playMusic = false
	const backMusic = new Audio('./audio/back-music.mp3')
	const musicButton = document.querySelector('.button__On')
	musicButton.addEventListener('click', function(){
		if(playMusic){
			backMusic.pause()
			musicButton.innerText = 'Music On'
		} else {
			backMusic.play()
			musicButton.innerText = 'Music Off'
		}
		playMusic = !playMusic
	})


	const tank = new Game(Tank, 'tank')
	tank.render('container')
	const btr = new Game(Btr, 'btr')
	const car = new Game(Car, 'car')
	function btrFunc (){
		setTimeout(()=>{
			btr.render('container')
		}, 5000)
	}
	function carFunc () {
		setTimeout(()=>{
			car.render('container')
		}, 10000)
	}
	btrFunc()
	carFunc()

}
//добавляємо курсор
document.body.classList.add('custom-cursor')

