# Combines multiple outXXXX.jpg.txt files into 1
path = "/storage/emulated/0/Extracted/frames-4fps/"

arr = []
for i in range(1, 877):
    file = open(path + f"out{i:04}.jpg.txt", "r")
    for line in file.readlines():
        arr.append(line)
    file.close()

file = open(path + "combined.txt", "w")
file.writelines(arr)
file.close()