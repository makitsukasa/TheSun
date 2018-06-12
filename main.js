/**
 * ザ・太陽のルール
 *   昼寝をしていた太陽が，うっかり寝返りをしてしまい，
 * 気がついてみると，顔が炎からはみ出してしまいました．
 *   太陽は自分ではどうすることもできず，ただ笑ってごま
 * かすばかりです．
 *
 *   駒をスライドさせて，太陽の顔のピースを炎の中に戻し
 * てあげてください．
 */

/**
  * init state
  * 072
  * 349
  * 618
  * 5AB
  *
  * goal state (tile.png is also this order)
  * 012
  * 345
  * 678
  * 9AB
  */

phina.globalize();

var SCREEN_WIDTH  = 1000;
var SCREEN_HEIGHT = 1000;
var ASSETS = {
	image: {
		tile:  'https://cdn.rawgit.com/makitsukasa/TheSun/4ff9019c/the-sun-tiles.png',
		frame: 'https://cdn.rawgit.com/makitsukasa/TheSun/4ff9019c/the-sun-frame.png',
	},
};

var INIT_STATE = [0, 7, 2, 3, 4, 9, 6, 1, 8, 5, 10, 11];
var GOAL_STATE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
var SPACE_TILE = 1;
var BIG_TILES  = [0, 3];

phina.define("Tile", {

	superClass: "Sprite",

	init: function(id){
		this.superInit('tile', 200, 200);
		this.id = id;
		this.frameIndex = id;
	},

});

/*
 * title scene
 */
phina.define('TitleScene', {
	superClass: 'DisplayScene',

	init: function() {
		this.superInit({
			width: SCREEN_WIDTH,
			height: SCREEN_HEIGHT,
		});

		this.gridX = Grid({width: SCREEN_WIDTH, columns: 5});
		this.gridY = Grid({width: SCREEN_HEIGHT, columns: 9});

		var label = Label('THE・太陽').addChildTo(this);
		label.x = this.gridX.center();
		label.y = this.gridY.span(1);
		label.fontSize = 50;
		label.fill = "#fff";

		var descLabel = Label('\
昼寝をしていた太陽が，うっかり寝返りをしてしまい，\n\
気がついてみると，顔が炎からはみ出してしまいました．\n\
  太陽は自分ではどうすることもできず，ただ笑ってごま\n\
かすばかりです．\n\
  駒をスライドさせて，太陽の顔のピースを炎の中に戻し\n\
てあげてください．\n')
            .addChildTo(this);
        descLabel.align = 'left';
        descLabel.x = this.gridX.center(-2);
		descLabel.y = this.gridY.span(3);
		descLabel.fill = "#fff";

		var startButton = phina.ui.Button().addChildTo(this);
		startButton.x = this.gridX.center();
		startButton.y = this.gridY.span(7.5);
		startButton.width = this.gridX.span(4);
		startButton.height = this.gridY.span(1);
		startButton.cornerRadius = this.gridY.span(0.5);
		startButton.text = "クリックでスタート";
		startButton.onclick = function(){this.parent.exit("main");};
		startButton.fontSize = 40;
		startButton.fill = 'rgba(240, 240, 240, 0.6)';

	},
});


/*
 * main scene
 */
phina.define("MainScene", {

	superClass: 'DisplayScene',

	init: function(options) {
		this.superInit(options);

		this.count = 0;
		this.tiles = [];
		this.gridX = Grid({width: 600, columns: 3, offset: (SCREEN_WIDTH  - 600 + 200) / 2});
		this.gridY = Grid({width: 800, columns: 4, offset: (SCREEN_HEIGHT - 800 + 200) / 2});
		MainScene = this;
		Sprite('frame')
			.setPosition(this.gridX.span(1), this.gridY.span(1.5))
			.addChildTo(this);
		Array.range(0, 12).each(function(it) {
			//it    = GOAL_STATE[it];
			var i = INIT_STATE[it];
			posX = MainScene.gridX.span((i % 3));
			posY = MainScene.gridY.span((i / 3 | 0));
			MainScene.tiles[i] = Tile(it)
				.setPosition(posX, posY)
				.setInteractive(true)
				.addChildTo(MainScene);
			MainScene.tiles[i].onclick = function(){MainScene.onTileClick(it)};
		});
	},

	onTileClick: function(tileId){
		if(tileId === BIG_TILES[0] || tileId === BIG_TILES[1]){
			pos = [];
			pos[0] = this.tiles.findIndex(function(tile){return tile.id === BIG_TILES[0]});
			pos[1] = this.tiles.findIndex(function(tile){return tile.id === BIG_TILES[1]});
			console.log(pos);
			if(pos[0] >= 3 && this.tiles[pos[0] - 3].id === SPACE_TILE){
				this.tiles[pos[0]].y -= 200;
				this.tiles[pos[1]].y -= 200;
				this.tiles[pos[0] - 3].y += 400;
				let hoge = this.tiles[pos[0]];
				this.tiles[pos[0]] = this.tiles[pos[1]];
				this.tiles[pos[1]] = this.tiles[pos[0] - 3];
				this.tiles[pos[0] - 3] = hoge;
				this.count++;
			}
			if(pos[1] <= 8 && this.tiles[pos[1] + 3].id === SPACE_TILE){
				this.tiles[pos[0]].y += 200;
				this.tiles[pos[1]].y += 200;
				this.tiles[pos[1] + 3].y -= 400;
				let hoge = this.tiles[pos[1]];
				this.tiles[pos[1]] = this.tiles[pos[0]];
				this.tiles[pos[0]] = this.tiles[pos[1] + 3];
				this.tiles[pos[1] + 3] = hoge;
				this.count++;
			}
		}
		else{
			pos = this.tiles.findIndex(function(tile){return tile.id === tileId});
			if(pos >= 3 && this.tiles[pos - 3].id === SPACE_TILE){
				let hoge = this.tiles[pos];
				this.tiles[pos] = this.tiles[pos - 3];
				this.tiles[pos - 3] = hoge;
				this.tiles[pos].y += 200;
				this.tiles[pos - 3].y -= 200;
				this.count++;
			}
			if(pos % 3 > 0 && this.tiles[pos - 1].id === SPACE_TILE){
				let hoge = this.tiles[pos];
				this.tiles[pos] = this.tiles[pos - 1];
				this.tiles[pos - 1] = hoge;
				this.tiles[pos].x += 200;
				this.tiles[pos - 1].x -= 200;
				this.count++;
			}
			if(pos <= 8 && this.tiles[pos + 3].id === SPACE_TILE){
				let hoge = this.tiles[pos];
				this.tiles[pos] = this.tiles[pos + 3];
				this.tiles[pos + 3] = hoge;
				this.tiles[pos].y -= 200;
				this.tiles[pos + 3].y += 200;
				this.count++;
			}
			if(pos % 3 < 2 && this.tiles[pos + 1].id === SPACE_TILE){
				let hoge = this.tiles[pos];
				this.tiles[pos] = this.tiles[pos + 1];
				this.tiles[pos + 1] = hoge;
				this.tiles[pos].x -= 200;
				this.tiles[pos + 1].x += 200;
				this.count++;
			}
		}
		this.clearCheck();
	},

	clearCheck: function(){
		for(var i = 0, n = INIT_STATE.length; i < n; i++) {
			if(this.tiles[i].id !== GOAL_STATE[i]){
				return;
			}
		}
		scene = this;
		setTimeout(() => {
			scene.exit("result", {
				score: scene.count,
			});
		}, 1000);
	},

});


/*
 * result
 */
phina.define('ResultScene', {
	superClass: 'DisplayScene',
	/*
	 * @constructor
	 */
	init: function(params) {
		params.width = SCREEN_WIDTH;
		params.height = SCREEN_HEIGHT;
		this.superInit(params);

		params = ({}).$safe(params, phina.game.ResultScene.defaults);

		var message = params.message.format(params);

		this.fromJSON({
			children: {
				scoreText: {
					className: 'phina.display.Label',
					arguments: {
						text: 'かかった手数',
						fill: params.fontColor,
						stroke: null,
						fontSize: 48,
					},
					x: this.gridX.span(8),
					y: this.gridY.span(4),
				},
				scoreLabel: {
					className: 'phina.display.Label',
					arguments: {
						text: params.score+'',
						fill: params.fontColor,
						stroke: null,
						fontSize: 72,
					},
					x: this.gridX.span(8),
					y: this.gridY.span(6),
				},
				messageLabel: {
					className: 'phina.display.Label',
					arguments: {
						text: message,
						fill: params.fontColor,
						stroke: null,
						fontSize: 32,
					},
					x: this.gridX.center(),
					y: this.gridY.span(9),
				},
				shareButton: {
					className: 'phina.ui.Button',
					arguments: [{
						text: 'ツイート',
						width: 256,
						height: 128,
						fontColor: params.fontColor,
						fontSize: 40,
						cornerRadius: 64,
						fill: 'rgba(240, 240, 240, 0.5)',
						// stroke: '#aaa',
						// strokeWidth: 2,
					}],
					x: this.gridX.center(-3),
					y: this.gridY.span(12),
				},
				playButton: {
					className: 'phina.ui.Button',
					arguments: [{
						text: 'もういっかい',
						width: 256,
						height: 128,
						fontColor: params.fontColor,
						fontSize: 40,
						cornerRadius: 64,
						fill: 'rgba(240, 240, 240, 0.5)',
						// stroke: '#aaa',
						// strokeWidth: 2,
					}],
					x: this.gridX.center(3),
					y: this.gridY.span(12),

					interactive: true,
					onpush: function() {
						LEVEL = 1;
						SCORE = 0;
						//this.exit(); // goes wrong
						location.reload();
					}.bind(this),
				},
			}
		});

		if (params.exitType === 'touch') {
			this.on('pointend', function() {
				this.exit();
			});
		}

		this.shareButton.onclick = function() {
		    var imgurl = 'https://twitter.com/tsukasa_boxy/status/1006341982040440832/photo/1';
			var text = 'THE・太陽を{0}手で解いた！\n'.format(params.score) + imgurl;
			var hashtags = "phina_js"
			var url = phina.social.Twitter.createURL({
				text: text,
				hashtags: hashtags,
				url: "http://runstant.com/tsukasa/projects/thesun/full",
				//url: window.location.href,
			});
			window.open(url, 'share window', 'width=480, height=320');
		};
	},

	_static: {
		defaults: {
			score: 0,

			message: '',
			hashtags: 'phina_js',
			url: phina.global.location && phina.global.location.href,

			fontColor: 'white',
			backgroundColor: 'hsl(200, 80%, 64%)',
			backgroundImage: '',
		},
	},

});


/*
 * メイン処理
 */
phina.main(function() {
	// アプリケーションを生成
	var app = GameApp({
	title: 'THE・太陽',
	backgroundColor: '#6CF',
		width:  SCREEN_WIDTH,  // 画面幅
		height: SCREEN_HEIGHT,// 画面高さ
		assets: ASSETS,       // アセット読み込み
	});

	//app.enableStats();

	// 実行
	app.run();
});