CC=g++
CFLAGS=-c -Wall
LDFLAGS=-lmraa
SOURCES=blink.cpp
OBJECTS=$(SOURCES:.cpp=.o)
	EXECUTABLE=blink

all: $(SOURCES) $(EXECUTABLE)

$(EXECUTABLE): $(OBJECTS) 
	$(CC) $(LDFLAGS) $(OBJECTS) -o $@

.cpp.o:
	$(CC) $(CFLAGS) $< -o $@
