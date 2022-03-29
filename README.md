# Reactions Module

Small zome to manage the reactions in your DNA, in RSM.

This module is designed to be included in other DNAs, assuming as little as possible from those. It is packaged as a holochain zome, and an npm package that offers native Web Components that can be used across browsers and frameworks.

> Notice that this zome still stores all reactions in the DNA in which the zome is included. Integration and bridging with personas & reactions will be done in the future, maintaining as much as possible the current API.

## Example Usage

For details on how to set the context and similar, see `ui/demo/index.html`.

### choosable-emoji-reaction together with reactions-row
```
<div class="row" style="display: flex;">
  <reactions-row .entryHash=[SOME_ENTRY_HASH]></reactions-row>
  <choosable-emoji-reaction .entryHash=[SOME_ENTRY_HASH]></choosable-emoji-reaction>
</div>
```
![image](https://user-images.githubusercontent.com/36768177/160661840-f40bd1ab-d12e-4dcc-897f-edce3b217a36.png)

### icon-reaction
  
```
<div style="display: flex;">
  <icon-reaction .entryHash=[SOME_ENTRY_HASH] onIcon="favorite" offIcon="favorite_border" reactionName="heart"></icon-reaction>
  <icon-reaction .entryHash=[SOME_ENTRY_HASH] onIcon="star" offIcon="star_border"></icon-reaction>
  <icon-reaction .entryHash=[SOME_ENTRY_HASH] onIcon="thumb_up_outlined" offIcon="thumb_up"></icon-reaction>
</div>
```

![image](https://user-images.githubusercontent.com/36768177/160662298-21758db2-0640-4ae6-9e52-783d4a0b1aea.png)

  
 
 
## Remarks

Reactions are implemented as links between entries and the agent public key of the agent reacting on the corresponding entry. As a consequence, if two authors each create an entry with identical content and consequently the same entry hash, the reactions module will be ignorant of the fact that there are two different create headers. In order to distinguish different content/author combinations, the contents themselves must be author specific (e.g. contain the entry author's public key).

![image](https://user-images.githubusercontent.com/36768177/160663822-1a32f50d-406f-4c21-9b97-9b27e3e11c58.png)

 


## Documentation

See our [installation instructions and documentation](https://holochain-open-dev.github.io/reactions).

## Developer setup

Visit the [developer setup](/dev-setup.md).
