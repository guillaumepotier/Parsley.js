#Changelog

** 0.2.0 **

    - heavy radio / checkbox refacto. Now dedicated class `ParsleyFieldMultiple`
    - added 3 custom checkbox validators: mincheck, maxcheck and rangecheck

** 0.1.4 **

    - added html5 api required="required" support
    - added radio and checkbox required (only) validation support. For now, to display
      nice errors, checkbox and radio with same name must be wrapped in a dedicated
      DOM parent on which parsley-error class would be binded and ul errors apend

** 0.1.3 **

    - fixed bug on addListener when added after Parsley initialisation. @gmajoulet

** 0.1.2 **

    - renamed listeners and added a public API to add / override these listeners