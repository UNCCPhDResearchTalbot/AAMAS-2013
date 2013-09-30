AAMAS-2013
==========

AAMAS 2013 Conference Paper Code

RulesEngine folder contains the code to run the scene in either baseline or rules-applied mode and generate log files.

Utilizing jsGameSoup for UI components and Node.js for processing, with natural, socket.io, and xml2js modules, and with javascript and HTML front-end.
		Install jsGameSoup
		install node.js
		npm natural
		npm socket.io
		npm xml2js

In main.js, change line:
		var BML = false;
to true if you want to use the BML baseline file, false if you want to use the natural language processing of the actual play-script.

		InputFile.txt ==> Hand-mapped BML code with some "triggers" for coinciding movements based on the 1964 Hamlet video
		InputScript.txt ==> Play-script from 1964 Hamlet video in natural language and formatted to play-script standards

To run:
start python for page hosting
		python -m SimpleHTTPServer 8888
start NodeJS module by running
		node server
Then, open index.html file to begin running the scene and logging the character traces.
		http://localhost:8888/index.html

===================================
Charts folder contains the D3js code to generate the charts to compare gaze direction for baseline only and rules blocking.  Chart labels aren't correct, but follow (from top to bottom) for the y axis:
stageright
audience
stageleft
backstage

x-axis represents time.  Upper lines will represent logs from the baseline / bmllogs folder, with the Lower lines representing the logs from the ruleslogs folder.

To chart for position instead of gaze direction, modify the "generateData" function in the d3linecharts.js file to change the postns.forEach loop to map the stagegrid column instead of the rotation column.  This will result in the y-axis displaying the following (from top to bottom):
downstage, stageleft
downstage, center
downstage, stageright
center, stageleft
centerstage
center, stageright
upstage, stageleft
upstage, center
upstage, stageright
offstage

To run:
start python for page hosting
		python -m SimpleHTTPServer 8888
Then, open chartraces.html file to begin running the scene and logging the character traces.
		http://localhost:8888/chartraces.html
Enter the filename that exists in both the bmllogs/ and ruleslogs/ folders for the character you want to compare gaze direction or position for.  Then, click the button

Folders contain sample files for running.

====================================
CharTraces contains the D3js code to generate character traces for all characters during a scene for either baseline or rules blocking.  Each character has a different shape, colors go from red to  blue to indicate time progression, and each shape points in the direction the character was facing at each timestep.

To run:
start python for page hosting
		python -m SimpleHTTPServer 8888
Then, open chartraces.html file to begin running the scene and logging the character traces.
		http://localhost:8888/chartraces.html
Enter the folder name that contains the log files to be plotted, such as ruleslogs/  or  bmllogs/  , then click the button.

Folders contain sample files for running.

