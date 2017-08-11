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
GameBoard.pList = newArray(14 * 10);
GameBoard.posKey = 0;

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