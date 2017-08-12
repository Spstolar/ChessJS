var PIECES = { EMPTY : 0, wP : 1, wN : 2, wB : 3, wR : 4, wQ: 5, wK : 6, bP : 7, bN : 8, bB : 9, bR: 10, bQ : 11, bK : 12 };  // could use const instead of var here, but some browsers don't like that 

var BRD_SQ_NUM = 120;

var FILES = { FILE_A : 0, FILE_B : 1, FILE_C : 2, FILE_D : 3, FILE_E : 4, FILE_F : 5, FILE_G : 6, FILE_H : 7, FILE_NONE : 8 };

var RANKS = { RANK_1 : 0, RANK_2 : 1, RANK_3 : 2, RANK_4 : 3, RANK_5 : 4, RANK_6 : 5, RANK_7 : 6, RANK_8 : 7, RANK_NONE : 8 };

var COLORS = { WHITE : 0, BLACK : 1, BOTH : 2 };  // this allows for each sideswitching with exclusive or: side ^= 1

var CASTLEBIT = { WKCA : 1, WQCA : 2, BKCA : 4, BQCA : 8 };

// there are two buffer ranks on each side, and a single buffer file on each side 
// 0 - 9 buffer 
// 10 - 19 buffer
// 20 buffer, 21 A1 (remember the flip notation used here)
var SQUARES = {  // I generated these in python with something like 
				 //for i in range(8): print chr(65+i) + str(1) + " : " + str(21 + i) + ", "
	A1 : 21,
	B1 : 22,
	C1 : 23,
	D1 : 24,
	E1 : 25,
	F1 : 26,
	G1 : 27,
	H1 : 28,
	A8 : 91,
	B8 : 92,
	C8 : 93,
	D8 : 94,
	E8 : 95,
	F8 : 96,
	G8 : 97,
	H8 : 98,
	NO_SQ : 99,
	OFFBOARD : 100
}

var BOOL = { FALSE : 0, TRUE : 1 };  // nice to use something like BOOL.FALSE rather than 0

var MAXGAMEMOVES = 2048;
var MAXPOSITIONMOVES = 256;
var MAXDEPTH = 64;

var FilesBrd = new Array(BRD_SQ_NUM);
var RanksBrd = new Array(BRD_SQ_NUM);

var START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

var PceChar = ".PNBRQKpnbrqk";
var SideChar = "wb-";
var RankChar = "12345678";
var FileChar = "abcdefgh";


function FR2SQ(f,r) { // convert a given file and rank to the square index 
	return ( ( 21 + (f) ) + ( (r) * 10 ) );
}

// Each of these is going through the indices for piece type (whitePawn, white Knight, etc.) and giving booling variables for each description. 
var PieceBig = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
var PieceMaj = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
var PieceMin = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PieceVal= [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000  ];
var PieceCol = [ COLORS.BOTH, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE,
	COLORS.BLACK, COLORS.BLACK, COLORS.BLACK, COLORS.BLACK, COLORS.BLACK, COLORS.BLACK ];
	
var PiecePawn = [ BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];	
var PieceKnight = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PieceKing = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE ];
var PieceRookQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];
var PieceBishopQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE ];
var PieceSlides = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];

var PieceKeys = new Array(14 * 120); // we'll use the empty slots for en passant
var SideKey;
var CastleKeys = new Array (16);

var Sq120ToSq64 = new Array(BRD_SQ_NUM);
var Sq64ToSq120 = new Array(64);

function RAND_32() {
	// this creates a random 32-bit number (maybe just 31 bit actually) by putting together 4 different samplings of 8 bit numbers
	//  return random int 1-255: Math.floor(Math.random()*255)+1)
	// the << is for bit-shifint, e.g.: 000101 << 2 is 010100
	return (Math.floor((Math.random()*255)+1) << 23) | (Math.floor((Math.random()*255)+1) << 16) | (Math.floor((Math.random()*255)+1) << 8) | Math.floor((Math.random()*255)+1);
}

function SQ64(sq120) {
	return Sq120ToSq64[(sq120)];
}

function SQ120(sq64) {
	return Sq64ToSq120[(sq64)];
}