#!/bin/bash

for f in ./profiles/*.log.txt; do
    rm $f
done

for f in isolate-*.log; do
    node --prof-process $f > ./profiles/$f.txt
    rm $f
done
