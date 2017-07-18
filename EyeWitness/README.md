# EyeWitness - a Websites Screenshots Tool

Repository site: https://github.com/ChrisTruncer/EyeWitness

## Usage

```
docker run --rm -it -v .:/tmp/EyeWitness vulhub/eyewitness -f /tmp/EyeWitness/input.txt --headless
```

## Build

You can build it with official Dockerfile:

```
git clone https://github.com/ChrisTruncer/EyeWitness
cd EyeWitness
docker build -t your_image_name .
```