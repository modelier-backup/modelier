# Modelier

__NOTE__: work in progress! this is not a thing yet!

This is an attempt to define a somewhat standard interface to create the model
part of a system. In a sense it is kind of an abstract of the
[active record](https://en.wikipedia.org/wiki/Active_record_pattern) married
with `Promise` and decoupled from the actual persistence layer.

The idea here is to define a _standard_, which then can be reimplemented with
different persistence layers underneath it. The point of all this exercise is
to decouple the application level code from the persistence layer; and bring
balance to the galaxy.

## Why Active Record

Active record, as any other, has its drawbacks. But, regardless of those it is
almost unbeatably good at one thing: representing tabular data.

In the end you don't have to build your app logic on top of active record. In
many cases it is simple enough to do so, in some it isn't. But, regardless to
the case, it is much easier to talk to an active record than to a database
directly.

## Docs && Usage

Please refer to the [docs section](./docs) for the actual documentation and usage
examples.

## Copyright & License

All code in this repository is released under the terms of the MIT license

Copyright (C) 2016 Nikolay Nemshilov
