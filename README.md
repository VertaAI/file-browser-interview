# File Browser Interview

This is the API server for the File Browser interview problem. Please check `index.html` for the instructions.

# How to use

1. `npm run start:server` in one shell
1. `npm start` in another shell
    * If UI does not appear, go [http://localhost:3000](here)

# What was used?
 1. `create-react-app` and all that that comes with
 1. `lodash.debounce` for standardized debouncing

# Methodology
 1. Cloned repo, ran create-react-app, merged CRA files into this dir
 1. Set a timer for 2 hours
 1. Fought hooks
 1. Timer went off, commented broken things, wrote post-mortem.

# Post-mortem

Welp, I did not get as far in this as I wanted to. The current platform I am working with is limited to a pre-hooks React version, so I got overambitious on using hooks in this case.

## What works

* Fetching files list
* Filtering files
* Changing result count
* Loading spinner during async calls
* Debouncing calls to server with a trailing debounce

## What I would do next

* Figure out that dang keybind issue. I left the code in, but commented out, that I was trying to use to set a global keybind.
    * Maybe I can pair on the team with this one? Would be fun to figure out
    * Yes, I'm in violation of the exhaustive-deps rule on this one. Again, I am a little rusty on hooks.
* Fulfill rest of requirements
* Refactor controls and files list into own components
* Tests where makes sense
* Wrap it all in a fun retro UI using [React95](https://github.com/arturbien/React95)