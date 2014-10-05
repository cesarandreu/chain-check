#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdlib.h>
#include <unistd.h>

#include "mraa.hpp"

#define DEFAULT_IOPIN 8
#define DEFAULT_NUMBLINKS 5

static int iopin;
static int numblinks;
int running = 0;

void sig_handler(int signo)
{
    if (signo == SIGINT) {
        printf("Closing IOPIN %d nicely...\n", iopin);
        running = -1;
    }
}

void parseOpts(int argc, char **argv)
{
    int opt;
    while ((opt = getopt(argc, argv, "p:n:")) != -1)
    {
        switch (opt)
        {
            case 'p':
                iopin = atoi(optarg);
                break;
            case 'n':
                numblinks = atoi(optarg);
                break;
            default:
                exit(EXIT_FAILURE);
        }
    }
}

int main (int argc, char **argv)
{
    iopin = DEFAULT_IOPIN;
    numblinks = DEFAULT_NUMBLINKS;
    parseOpts(argc, argv);

    signal(SIGINT, sig_handler);

    mraa::Gpio* gpio = new mraa::Gpio(iopin);
    if (gpio == NULL) {
        return MRAA_ERROR_UNSPECIFIED;
    }
    mraa_result_t response = gpio->dir(mraa::DIR_OUT);
    if (response != MRAA_SUCCESS) {
        mraa::printError(response);
        return 1;
    }

    while (running == 0 && numblinks > 0) {
        response = gpio->write(1);
        sleep(1);
        response = gpio->write(0);
        sleep(1);
        numblinks--;
    }
    delete gpio;
    return response;
}
