var ROM;
var newROM;
var fileBox = document.getElementById('fileInput');

const flipTable = [ 0x00, 0x80, 0x40, 0xc0, 0x20, 0xa0, 0x60, 0xe0, 0x10, 0x90, 0x50, 0xd0, 0x30, 0xb0, 0x70, 0xf0, 0x08, 0x88, 0x48, 0xc8, 0x28, 0xa8, 0x68, 0xe8, 0x18, 0x98, 0x58, 0xd8, 0x38, 0xb8, 0x78, 0xf8, 0x04, 0x84, 0x44, 0xc4, 0x24, 0xa4, 0x64, 0xe4, 0x14, 0x94, 0x54, 0xd4, 0x34, 0xb4, 0x74, 0xf4, 0x0c, 0x8c, 0x4c, 0xcc, 0x2c, 0xac, 0x6c, 0xec, 0x1c, 0x9c, 0x5c, 0xdc, 0x3c, 0xbc, 0x7c, 0xfc, 0x02, 0x82, 0x42, 0xc2, 0x22, 0xa2, 0x62, 0xe2, 0x12, 0x92, 0x52, 0xd2, 0x32, 0xb2, 0x72, 0xf2, 0x0a, 0x8a, 0x4a, 0xca, 0x2a, 0xaa, 0x6a, 0xea, 0x1a, 0x9a, 0x5a, 0xda, 0x3a, 0xba, 0x7a, 0xfa, 0x06, 0x86, 0x46, 0xc6, 0x26, 0xa6, 0x66, 0xe6, 0x16, 0x96, 0x56, 0xd6, 0x36, 0xb6, 0x76, 0xf6, 0x0e, 0x8e, 0x4e, 0xce, 0x2e, 0xae, 0x6e, 0xee, 0x1e, 0x9e, 0x5e, 0xde, 0x3e, 0xbe, 0x7e, 0xfe, 0x01, 0x81, 0x41, 0xc1, 0x21, 0xa1, 0x61, 0xe1, 0x11, 0x91, 0x51, 0xd1, 0x31, 0xb1, 0x71, 0xf1, 0x09, 0x89, 0x49, 0xc9, 0x29, 0xa9, 0x69, 0xe9, 0x19, 0x99, 0x59, 0xd9, 0x39, 0xb9, 0x79, 0xf9, 0x05, 0x85, 0x45, 0xc5, 0x25, 0xa5, 0x65, 0xe5, 0x15, 0x95, 0x55, 0xd5, 0x35, 0xb5, 0x75, 0xf5, 0x0d, 0x8d, 0x4d, 0xcd, 0x2d, 0xad, 0x6d, 0xed, 0x1d, 0x9d, 0x5d, 0xdd, 0x3d, 0xbd, 0x7d, 0xfd, 0x03, 0x83, 0x43, 0xc3, 0x23, 0xa3, 0x63, 0xe3, 0x13, 0x93, 0x53, 0xd3, 0x33, 0xb3, 0x73, 0xf3, 0x0b, 0x8b, 0x4b, 0xcb, 0x2b, 0xab, 0x6b, 0xeb, 0x1b, 0x9b, 0x5b, 0xdb, 0x3b, 0xbb, 0x7b, 0xfb, 0x07, 0x87, 0x47, 0xc7, 0x27, 0xa7, 0x67, 0xe7, 0x17, 0x97, 0x57, 0xd7, 0x37, 0xb7, 0x77, 0xf7, 0x0f, 0x8f, 0x4f, 0xcf, 0x2f, 0xaf, 0x6f, 0xef, 0x1f, 0x9f, 0x5f, 0xdf, 0x3f, 0xbf, 0x7f, 0xff ];
const analogueHeader = [
	0x01, 0x10, 0xce, 0xef, 0x00, 0x00, 0x44, 0xaa, 0x00, 0x74, 0x00, 0x18, 0x11, 0x95, 0x00, 0x34,
        0x00, 0x1a, 0x00, 0xd5, 0x00, 0x22, 0x00, 0x69, 0x6f, 0xf6, 0xf7, 0x73, 0x09, 0x90, 0xe1, 0x10,
        0x44, 0x40, 0x9a, 0x90, 0xd5, 0xd0, 0x44, 0x30, 0xa9, 0x21, 0x5d, 0x48, 0x22, 0xe0, 0xf8, 0x60
];

// Convert bit instructions
const BITInst = [
	0x40, 0x48, 0x50, 0x58, 0x60, 0x68, 0x70, 0x78
];
const BITSwap = [
	0x78, 0x70, 0x68, 0x60, 0x58, 0x50, 0x48, 0x40
];
function BSwap(b, checkVal = 0xFF) {
	var mask = b & ~(0x07);
	var val = b & 0x07;
	if ((checkVal !== 0xFF) && (val !== checkVal)) {
		return 0;
	}
	for (var i=0; i<8; i++) {
		if (BITInst[i] == mask) {
			return (BITSwap[i] + val);
		}
	}
	return 0;
}

// Convert set instructions
const SETInst = [
	0xC0, 0xC8, 0xD0, 0xD8, 0xE0, 0xE8, 0xF0, 0xF8
];
const SETSwap = [
	0xF8, 0xF0, 0xE8, 0xE0, 0xD8, 0xD0, 0xC8, 0xC0
];
function SSwap(b, checkVal = 0xFF) {
	var mask = b & ~(0x07);
	var val = b & 0x07;
	if ((checkVal !== 0xFF) && (val !== checkVal)) {
		return 0;
	}
	for (var i=0; i<8; i++) {
		if (SETInst[i] == mask) {
			return SETSwap[i] + val;
		}
	}
	return 0;
}

// Convert res instructions (A only)
const RESInst = [
	0x80, 0x88, 0x90, 0x98, 0xA0, 0xA8, 0xB0, 0xB8
];
const RESSwap = [
	0xB8, 0xB0, 0xA8, 0xA0, 0x98, 0x90, 0x88, 0x80
];
function RSwap(b, checkVal = 0xFF) {
	var mask = b & ~(0x07);
	var val = b & 0x07;
	if ((checkVal !== 0xFF) && (val !== checkVal)) {
		return 0;
	}
	for (var i=0; i<8; i++) {
		if (RESInst[i] == mask) {
			return RESSwap[i] + val;
		}
	}
	return 0;
}

const AllowedLCDC = [
	0xE3, 0xAB, 0x80, 0x8B, 0x93
];
const AllowedSTAT = [
	0x08
];

function LCDC_XOR(b) {
	// xor a
	if (ROM[b+0] !== 0xAF) {
		return 0;
	}

	// LDH [LCDC], a
	if (ROM[b+1] !== 0xE0) {
		return 0;
	}

	if (ROM[b+2] !== 0x40) {
		return 0;
	}

	// Fix LCDC
	newROM[b+2] = 0x4E;
	
	console.log("Found LCDC XOR at: " + b);
	return 3;
}

function LCDC_LD(b) {
	// If this loads something into a, check if the next instruction is LDH [LCDC], a
	if (ROM[b+0] !== 0x3E) {
		return 0;
	}
	
	// Make sure that the LCDC value we're writing is one of the allowed LCDC values
	// This gets rid of false positives
	var LCDC = ROM[b+1];
	if (!AllowedLCDC.includes(LCDC)) {
		return 0;
	}

	// Make sure we're writing a into LCDC
	if (ROM[b+2] != 0xE0) {
		return 0;
	}
	if (ROM[b+3] != 0x40) {
		return 0;
	}

	// Flip the byte and LCDC
	newROM[b+1] = flipTable[LCDC];
	newROM[b+3] = 0x4E;
	console.log("Found LCDC LD at: " + b);
	return 4;
}

function LCDC_RS_BIT(b) {
	// LDH a, LCDC
	if (ROM[b+0] !== 0xF0) {
		return 0;	
	}
	if (ROM[b+1] !== 0x40) {
		return 0;
	}

	// Handle Set/Reset instructions
	var idx = b+2;
	var sr;
	while (ROM[idx] == 0xCB) {
		// Handle this instruction (set)
		sr = SSwap(ROM[idx + 1], 0x07);	// Must be reg a
		if (sr !== 0) {
			newROM[idx + 1] = sr;
		}

		// Handle this instruction (res)
		sr = RSwap(ROM[idx + 1], 0x07);	// Must be reg a
		if (sr !== 0) {
			newROM[idx + 1] = sr;
		}

		// Move to the next instruction
		idx += 2;	
	}
	// If there were no instructions, this doesn't pass
	if (idx == b+2) {
		return 0;
	}

	// LDH LCDC, a
	if (ROM[idx + 0] !== 0xE0) {
		return 0;
	}
	if (ROM[idx + 1] !== 0x40) {
		return 0;
	}

	// Fix LCDC, the bit operations are already fixed
	newROM[b+1] = 0x4E;
	newROM[idx + 1] = 0x4E;
	console.log("LCDC SET BIT found at: " + b);
	return 6;
}

function LCDC_BIT_JR(b) {
	// LDH a, LCDC
	if (ROM[b+0] !== 0xF0) {
		return 0;
	}
	if (ROM[b+1] !== 0x40) {
		return 0;
	}
	// BIT X, a
	if (ROM[b+2] !== 0xCB) {
		return 0;
	}
	var bt = BSwap(ROM[b+3], 0x07);	// Must be reg a
	if (bt == 0) {
		return 0;
	}

	// JR NZ, s8 | JR Z, s8 | JR NC, s8 | JR C, s8
	var j = ROM[b+4];
	if ((j !== 0x20) && (j != 0x28) && (j != 0x30) && (j != 0x38)) {
		return 0;
	}

	// Flip the bit access and fix LCDC
	newROM[b+1] = 0x4E;
	newROM[b+3] = bt;
	console.log("Found LCDC BIT JR at: " + b);
	return 6;
}

function LCDC_BIT_JP(b) {
	// LDH a, LCDC
	if (ROM[b+0] !== 0xF0) {
		return 0;
	}
	if (ROM[b+1] !== 0x40) {
		return 0;
	}
	// BIT X, a
	if (ROM[b+2] !== 0xCB) {
		return 0;
	}
	var bt = BSwap(ROM[b+3], 0x07);	// Must be reg a
	if (bt == 0) {
		return 0;
	}

	// JP NZ, u16 | JP Z, u16 | JP NC, u16 | JP C, u16
	var j = ROM[b+4];
	if ((j !== 0xC2) && (j != 0xCA) && (j != 0xD2) && (j != 0xDA)) {
		return 0;
	}

	// Flip the bit access and fix LCDC
	newROM[b+1] = 0x4E;
	newROM[b+3] = bt;
	console.log("Found LCDC BIT JP at: " + b);
	return 7;
}
	
function LCDC_BIT_RET(b) {
	// LDH a, LCDC
	if (ROM[b+0] !== 0xF0) {
		return 0;
	}
	if (ROM[b+1] !== 0x40) {
		return 0;
	}
	// BIT X, a
	if (ROM[b+2] !== 0xCB) {
		return 0;
	}
	var bt = BSwap(ROM[b+3], 0x07);	// Must be reg a
	if (bt == 0) {
		return 0;
	}

	// RET z
	if (ROM[b+4] !== 0xC8) {
		return 0;
	}

	// Flip the bit access and fix LCDC
	newROM[b+1] = 0x4E;
	newROM[b+3] = bt;
	console.log("Found LCDC BIT RET at: " + b);
	return 5;
}

function LCDC_ADD(b) {
	// LDH a, LCDC
	if (ROM[b+0] !== 0xF0) {
		return 0;
	}
	if (ROM[b+1] !== 0x40) {
		return 0;
	}
	// ADD a
	if (ROM[b+2] !== 0x87) {
		return 0;
	}
	// JR c, s8
	if (ROM[b+3] !== 0x38) {
		return 0;
	}

	// Replace the address and fix the check
	newROM[b+1] = 0x4E;
	newROM[b+2] = 0x0F;
	console.log("Found LCDC ADD at: " + b);
	return 5;
}

function LCDC_AND(b) {
	// LDH a, LCDC
	if (ROM[b+0] !== 0xF0) {
		return 0;	
	}
	if (ROM[b+1] !== 0x40) {
		return 0;
	}

	// AND d8
	if (ROM[b+2] !== 0xE6) {
		return 0;
	}

	// LDH LCDC, a
	if (ROM[b+4] !== 0xE0) {
		return 0;
	}
	if (ROM[b+5] !== 0x40) {
		return 0;
	}

	// Fix LCDC and fix the AND value
	newROM[b+1] = 0x4E;
	newROM[b+3] = flipTable[ROM[b+3]];
	newROM[b+5] = 0x4E;
	console.log("LCDC AND found at: " + b);
	return 6;
}

function LCDC_FF40(b) {
	// LD hl, ff40
	if (ROM[b+0] !== 0x21) {
		return 0;	
	}
	if (ROM[b+1] !== 0x40) {
		return 0;
	}
	if (ROM[b+2] !== 0xFF) {
		return 0;
	}

	// Handle Set/Reset instructions
	var idx = b+3;
	var sr;
	while (ROM[idx] == 0xCB) {
		// Handle this instruction (set)
		sr = SSwap(ROM[idx + 1]);
		if (sr !== 0) {
			newROM[idx + 1] = sr;
		}

		// Handle this instruction (res)
		sr = RSwap(ROM[idx + 1]);
		if (sr !== 0) {
			newROM[idx + 1] = sr;
		}

		// Move to the next instruction
		idx += 2;	
	}
	// If there were no instructions, this doesn't pass
	if (idx == b+3) {
		return 0;
	}

	newROM[b+1] = 0x4E;
	console.log("LCDC FF40 found at: " + b);
	return 0;
}

// This is an annoying one, STAT is checked with LD a, [c]; AND b
function STAT_BC(b) {
	// ld b, $02
	if (ROM[b+0] !== 0x06) {
		return 0;
	}

	if (ROM[b+1] !== 0x02) {
		return 0;
	}

	// ld c, $41
	if (ROM[b+2] !== 0x0E) {
		return 0;
	}

	if (ROM[b+3] !== 0x41) {
		return 0;
	}

	// pop de
	// Just a check to make sure we're not mis-identifying this code
	if (ROM[b+4] !== 0xD1) {
		return 0;
	}

	// Replace the STAT value
	newROM[b+1] = flipTable[ROM[b+1]];
	console.log("STAT BC found at: " + b);
	return 5;
}

function STAT_LD(b) {
	// If this loads something into a, check if the next instruction is LDH [STAT], a
	if (ROM[b+0] !== 0x3E) {
		return 0;
	}
	
	// Make sure that the STAT value we're writing is one of the allowed STAT values
	// This gets rid of false positives
	var STAT = ROM[b+1];
	if (!AllowedSTAT.includes(STAT)) {
		return 0;
	}

	// Make sure we're writing a into STAT
	if (ROM[b+2] != 0xE0) {
		return 0;
	}
	if (ROM[b+3] != 0x41) {
		return 0;
	}

	// Flip the byte
	newROM[b+1] = flipTable[STAT];
	console.log("Found STAT LD at: " + b);
	return 4;
}

function STAT_AND(b) {
	// LDH a, STAT
	if (ROM[b+0] !== 0xF0) {
		return 0;
	}
	if (ROM[b+1] !== 0x41) {
		return 0;
	}
	// AND s8
	if (ROM[b+2] !== 0xE6) {
		return 0;
	}
	
	// JR NZ, s8 | JR Z, s8 | JR NC, s8 | JR C, s8
	var j = ROM[b+4];
	if ((j !== 0x20) && (j != 0x28) && (j != 0x30) && (j != 0x38)) {
		return 0;
	}

	// Flip the AND value
	newROM[b+3] = flipTable[ROM[b+3]];
	console.log("STAT AND found at: " + b);
	return 6;
}

fileBox.onchange = function (e) {
	e.preventDefault();

	var file = fileBox.files[0];
	if (!file) {
		return;
	}
	var reader = new FileReader();
	reader.onload = function(e) {
		contents = e.target.result;
		console.log(contents.byteLength);
		outputContents = new ArrayBuffer(contents.byteLength);
		// Create views for manipulation
		ROM = new Uint8Array(outputContents);
		newROM = new Uint8Array(contents);

		// Copy the contents, we'll manipulate bytes in outputContents
		new Uint8Array(outputContents).set(new Uint8Array(contents));

		// Replace the header
		for (var i=0; i<analogueHeader.length; i++) {
			newROM[i + 0x104] = analogueHeader[i];
		}
		console.log("Analogue Header Inserted");

		// Fix the cart type, if it's MBC3
		if (ROM[0x147] == 0x10) {
			newROM[0x147] = 0x1B;
			console.log("Changed cartridge type from MBC3 to MBC5");
		}

		var lastIdx = 0;
		var idx = 0;
		var skipN = 0;

		while (idx < ROM.byteLength) {
			if ((idx % 100000) == 0) {
				console.log("Progress: " + idx + " bytes");
			}

			// Looking for xor a => LCDC
			skipN = LCDC_XOR(idx);
			if (skipN > 0) {
				idx += skipN;
				continue;
			}

			// Looking for LCDC = XX
			skipN = LCDC_LD(idx);
			if (skipN > 0) {
				idx += skipN;
				continue;
			}

			// Looking for LCDC set/res bit X
			skipN = LCDC_RS_BIT(idx);
			if (skipN > 0) {
				idx += skipN;
				continue;
			}

			// Looking for LCDC bit X, jr
			skipN = LCDC_BIT_JR(idx);
			if (skipN > 0) {
				idx += skipN;
				continue;
			}
			
			// Looking for LCDC bit X, jp
			skipN = LCDC_BIT_JP(idx);
			if (skipN > 0) {
				idx += skipN;
				continue;
			}
			
			// Looking for LCDC bit X, ret z
			skipN = LCDC_BIT_RET(idx);
			if (skipN > 0) {
				idx += skipN;
				continue;
			}

			// Looking for LCDC add a, jr c
			skipN = LCDC_ADD(idx);
			if (skipN > 0) {
				idx += skipN;
				continue;
			}

			// Looking for LCDC = LCDC & XX
			skipN = LCDC_AND(idx);
			if (skipN > 0) {
				idx += skipN;
				continue;
			}

			// Looking for ld ff40, res/set
			skipN = LCDC_FF40(idx);
			if (skipN > 0) {
				idx += skipN;
				continue;
			}
			
			// Looking for STAT BC
			skipN = STAT_BC(idx);
			if (skipN > 0) {
				idx += skipN;
				continue;
			}

			// Looking for STAT = XX
			skipN = STAT_LD(idx);
			if (skipN > 0) {
				idx += skipN;
				continue;
			}

			// Looking for STAT = STAT & XX; jr
			skipN = STAT_AND(idx);
			if (skipN > 0) {
				idx += skipN;
				continue;
			}

			// No matches, next byte
			idx++;
		}

		const link = document.createElement( 'a' );
		link.style.display = 'none';
		document.body.appendChild( link );

		const blob = new Blob( [ newROM ], { type: 'application/octet-stream' } );
		const objectURL = URL.createObjectURL( blob );


		link.href = objectURL;
		link.href = URL.createObjectURL( blob );
		link.download =  file.name.substring(0,56) + ".pocket";
		link.click();
	};
	reader.readAsArrayBuffer(file);
}