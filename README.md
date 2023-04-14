# Wominjeka

Commonly "Welcome" in Woiwurrung. Standalone Chat API for Yipnyap, and hopefully APIv3 in the future, maybe.

That would need a translation layer for WordPress, but that's not a problem... maybe one day if one of us is bored or
clinically insane.

## Disclaimers

### WIP & Opt-in

This is a work in progress, and is not ready for production use. It is not recommended to use this in production, as it
is not stable, and may break at any time.

Users on Yipnyap **must opt-into this**, as some data will need to be replicated to the database that this API uses.

### IntelliJ IDEA

This project is developed in IntelliJ IDEA, and as such, the project files are included. If you use another IDE, you may
need to convert the project files manually. These project files contain, but not limited to:

- IDEA-specific run & service configurations
- Configured to use WSL for terminal & run configs
- Yipnyap Code Style & Linting
- Dictionary
- Project Structure
- Indexes (for intellisense - generally makes it easier to work with the project, but also adds size to the project)

If you need IDEA, you can get it from [here](https://www.jetbrains.com/idea/). Yipnyap can't supply you with a license,
but you can get one from JetBrains. If you can't afford it, you can use the EAP (Early Access Program) version, which is
free, but may be unstable, and expires after a certain time until the next major EAP release, in which the IDE becomes
unusable.

Feel free to use any IDE you want, but don't include the project files specific to that IDE. Add it to .gitignore if you
can.

## Installation

You need bun. If you have windows, you need WSL2.

todo: add installation instructions lmao

1. get it working
2. `bun install`
2. `bun start`
3. woo hoo!
