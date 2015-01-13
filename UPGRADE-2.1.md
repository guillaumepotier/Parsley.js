# UPGRADE FROM 2.0.x to 2.1.0

## General

2.1.0 version introduced some minor BC Breaks. Here is the list:

### `isValid()` field methods returns boolean. If you had a test case like this:

```javascript
if ('object' === typeof $('#field').parsley().isValid() && !$('#field').parsley().isValid().length) {
    // field is optional and empty, nor valid, nor invalid
}
```

becomes

```javascript
if ($('#field').parsley().isValid() && !$('#field').parsley().needsValidation()) {
    // field is optional and empty, nor valid, nor invalid
}
```
