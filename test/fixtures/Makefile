generate: helloWorld
	strings helloWorld > defaultOutput.txt
	strings helloWorld -n 10 > tenChars.txt
	strings test.zip > zipOutput.txt

helloWorld: helloWorld.c
	gcc -o helloWorld helloWorld.c

clean:
	rm helloWorld *.txt

.phony: generate clean
