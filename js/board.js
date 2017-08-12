function PCEINDEX(pce, pceNum) {
	return (pce * 10 + pceNum);
}

var GameBoard = {};

GameBoard.pieces = new Array(BRD_SQ_NUM);
GameBoard.side = COLORS.WHITE;
GameBoard.fiftyMove = 0;
GameBoard.hisPly = 0;
GameBoard.ply = 0;
GameBoard.enPas = 0;
GameBoard.castlePerm = 0;
/* Storing castling perimissions as 8bit info

0001 = 1 only white kingside castle 
1101 = 13  all castling except for white queenside
*/
GameBoard.material = new Array(2);  // WHITE, BLACK material 
GameBoard.pceNum = new Array(13);  // indexed by piece for how many of that type there are
GameBoard.pList = new Array(14 * 10);
GameBoard.posKey = 0;

GameBoard.moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES);
GameBoard.moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES);
GameBoard.moveListStart = new Array(MAXDEPTH);

function GeneratePosKey() {
	
	var sq = 0;
	var finalKey = 0;
	var piece = PIECES.EMPTY;
	
	for(sq = 0; sq < BRD_SQ_NUM; ++sq) {
		piece = GameBoard.pieces[sq];
		if(piece != PIECES.EMPTY &&  piece != SQUARES.OFFBOARD) {
			finalKey ^= PieceKeys[(piece * 120) + sq];
		}
	}
	
	if(GameBoard.side == COLORS.WHITE) {
		finalKey ^= SideKey;
	}
	
	if(GameBoard.enPas != SQUARES.NO_SQ) {
		finalKey ^= PieceKeys[GameBoard.enPas];
	}
	
	finalKey ^= CastleKeys[GameBoard.castlePerm];
	
	return finalKey;
}

function ResetBoard() {
	
	var index = 0;
	
	for(index = 0; index < BRD_SQ_NUM; ++index) {
		GameBoard.pieces[index] = SQUARES.OFFBOARD;
	}
	
	for(index = 0; index < 64; ++index) {
		GameBoard.pieces[SQ120(index)] = PIECES.EMPTY;
	}
	
	for(index = 0; index < 14 * 120; ++index) {
		GameBoard.pList[index] = PIECES.EMPTY;
	}
	
	for(index = 0; index < 2; ++index) {
		GameBoard.material[index] = 0;
	}
	
	for(index = 0; index < 13; ++index) {
		GameBoard.pceNum[index] = 0;
	}
	
	GameBoard.side = COLORS.BOTH;
	GameBoard.enPas = SQUARES.NO_SQ;
	GameBoard.fiftyMove = 0;
	GameBoard.ply = 0;
	GameBoard.hisPly = 0;
	GameBoard.castlePerm = 0;
	GameBoard.posKey = 0;
	GameBoard.moveListStart[GameBoard.Ply] = 0;
}

// Example FEN string:   rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3
// rank8/rank7/.../rank1 to_move castling en_passant
function ParseFen(fen) {
	
	ResetBoard();
	
	var rank = RANKS.RANK_8;
	var file = FILES.FILE_A;
	var piece = 0;
	var count = 0;
	var i = 0;
	var sq120 = 0;
	var fenCnt = 0;
	
	while ((rank >= RANKS.RANK_1) && fenCnt < fen.length) {
		count = 1;
		switch (fen[fenCnt]) {
			case 'p': piece = PIECES.bP; break;
			case 'r': piece = PIECES.bR; break;
			case 'n': piece = PIECES.bN; break;
			case 'b': piece = PIECES.bB; break;
			case 'k': piece = PIECES.bK; break;
			case 'q': piece = PIECES.bQ; break;
			case 'P': piece = PIECES.wP; break;
			case 'R': piece = PIECES.wR; break;
			case 'N': piece = PIECES.wN; break;
			case 'B': piece = PIECES.wB; break;
			case 'K': piece = PIECES.wK; break;
			case 'Q': piece = PIECES.wQ; break;
			
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
				piece = PIECES.EMPTY;
				count = fen[fenCnt].charCodeAt() - '0'.charCodeAt();
				break;
				
			case '/':
			case ' ':
				rank--;
				file = FILES.FILE_A;
				fenCnt++;
				continue;
			default:
				console.log("FEN error");
				return;
		}
		
		for (i = 0; i < count; i++) {
			sq120 = ER2SQ(file,rank);
			brd_pieces[sq120] = piece;
			file++;
		}
		fenCnt++ 
	}
	
}






















