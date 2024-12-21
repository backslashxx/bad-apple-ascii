#include <stdio.h>
#include <time.h>

int main(int argc, char *argv[]) {
    if (argc != 6) {
        printf("Usage: ./badapple <path> <height> <width> <frames> <sleep>");
        return 0;
    }

    int height = atoi(argv[2]); // number of lines per frame
    int width = atoi(argv[3]); // number of chars per line
    int frames = atoi(argv[4]); // number of frames

    FILE *fptr = fopen(argv[1], "r");

    int frame_chrcnt = (width + 1) * height; //include \n
    char out[frame_chrcnt + 1]; //str null char
    out[frame_chrcnt] = '\0';

    const struct timespec req = {0, atoi(argv[5])}; // in nanosec

    for (int i = 0; i < frames; ++i) {
        fread(out, 1, frame_chrcnt, fptr);
        printf("%s", out);
        fflush(stdout);
        nanosleep(&req, NULL);
    }
    return 0;
}
