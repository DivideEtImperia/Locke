![The internationalization handler of Bastion](https://i.imgur.com/3UBXzNe.png)

### Director Sturcture for locales
```bash
ProjectDir/
└─── locales
     ├─── constants.json
     ├─── en_us
     │    ├─── error.json
     │    ├─── info.json
     │    └─── warn.json
     └─── en_uk
          ├─── error.json
          ├─── info.json
          └─── warn.json
```


**TODO:**
- [X] Add support for a global constants across all locales.
- [X] Add support for variables in translated strings.
- [ ] Add support for using single file locales, for simple projects. Like:
  ```bash
    # Director Sturcture for locales
    ProjectDir/
    └──── Locales
          ├─── constants.json
          ├─── en_us.json
          └─── en_uk.json
  ```
