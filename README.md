This site adds a few simple tweaks to the feisworx web site,
in order to make it look better on a phone.

The iPhone doesn't allow browser plugins.
So I had to create a whole app just to drop in some JavaScript.

Hopefully one day feisworx integrates this and I can take my site down.

Testing
-------

First you should download static content,
so you're not hammering away at the feisworx site
for static resources.

    ./fetch-static.sh


Then you can test with

    go run .

