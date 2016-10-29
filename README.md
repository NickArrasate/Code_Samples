# Code_Samples

## map.js from NeverwinterNW.com

This is a sample taken from a site I built with Jekyll and Liquid.

It demonstrates a dynamic map that automatically plots markers and tooltip info for vendors as they are added by the client
through the CMS.

The client has locations in multiple parts of the state so I added buttons to navigate through them.

The map can be viewed at https://neverwinternw.com/, a site I built myself.


##Guavagrams (interface and logic)

These to .js files contain the logic for a game built while at Epicodus. The game was built by myself and two others over the course of a four day sprint. It is not currently hosted but it can easily be run locally
by downloading it and following the README at https://github.com/NickArrasate/Demo_Day_Guava. It is written in Node.js.

In brief, this is a word game where the player receives a set of letters and is tasked to place them all
onto the board to form interlocking words, much like a crossword.

We built the game to include a pleasing 'drag and drop' game board interface.

The 'logic' file contains the code for checking the user's solution. It reads all the game tiles horizontally and vertically and checks that all letters have been used. It also handles generating the user's hand. We gave each letter a weight and use a random number generator to decide what tiles will appear.

The 'interface' file handles a timer, the 'drag and drop' functionality and handles checking the users inputted solution against a dictionary. It also handles errors and win conditions.
