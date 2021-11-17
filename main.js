const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

let currentlyPlaying = true;

class Field {
    constructor(field) {
        this._field = field;
        this.x = 0;
        this.y = 0;
    }

    //getter
    get field() {
        return this._field;
    }

    //Print the field
    print() {
        console.log(this._field.map((row) => row.join("")).join("\n"));
    }

    static generateField(height, width, difficulty = 1) {
        //Function to add more holes depending on the difficulty
        const FieldOrHole = (difficulty) => {
            const probability = Math.random() * 10;
            let finalSelection = "";

            if (difficulty > probability) {
                finalSelection = hole;
            } else {
                finalSelection = fieldCharacter;
            }
            return finalSelection;
        };

        //Field generation
        const gameField = (height, width, difficulty) => {
            //Field with holes
            let field = [];
            for (let i = 0; i < height; i++) {
                field.push([]);
                for (let j = 0; j < width; j++) {
                    field[i].push(FieldOrHole(difficulty));
                }
            }
            //Places Hat
            let hatX = Math.floor(Math.random() * width);
            let hatY = Math.floor(Math.random() * height);
            field[hatY][hatX] = hat;

            //Places player
            field[0][0] = pathCharacter;
            return field;
        };
        return gameField(height, width, difficulty);
    }

    //Get the player's move and check for correct input
    move() {
        const validMoves = ["W", "A", "S", "D"];
        let direction = prompt(
            'Choose a move ("W" to up, "S" to down, "A" to left, "D" to right): '
        );

        while (!validMoves.includes(direction.toUpperCase())) {
            direction = prompt(
                'Please enter a valid direction: "W, A, S or D": '
            );
        }
        switch (direction.toUpperCase()) {
            case "W":
                console.log("Moving up");
                this.y -= 1;
                break;
            case "S":
                console.log("Moving down");
                this.y += 1;
                break;
            case "A":
                console.log("Moving left");
                this.x -= 1;
                break;
            case "D":
                console.log("Moving right");
                this.x += 1;
                break;
        }
    }

    //Check the moves
    checkWin() {
        this.move();
        if (this.field[this.y] === undefined) {
            console.log("You lose - You fell off the field");
            return (currentlyPlaying = false);
        }

        switch (this.field[this.y][this.x]) {
            case hole:
                console.log("You lose - You fell in a hole!");
                currentlyPlaying = false;
                break;
            case undefined:
                console.log("You lose - You fell off the field");
                currentlyPlaying = false;
                break;
            case hat:
                console.log("You win - You found the hat!");
                currentlyPlaying = false;
                break;
            case fieldCharacter:
                this.field[this.y][this.x] = pathCharacter;
                break;
            case pathCharacter:
                console.log("Hey! You can't go back! - You Lose");
                break;
        }
    }
}
//Game Logic
const play = (gameField) => {
    while (currentlyPlaying) {
        gameField.print();
        gameField.checkWin();
    }
    console.log("Game Over");
};

const myField = Field.generateField(10, 10, 3);
const myGameField = new Field(myField);

play(myGameField);