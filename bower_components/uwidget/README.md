# Universal Widget

The aim of this very simple widget is to easily display a API-distant collection
of objects, with simple sorting and filters option.

# Requirements

jQuery >= 1.6

# Installation

```html
<html>
<head>
<link href="gh-issues-widget.css" rel="stylesheet">
</head>
<body>
  <div class="uwidget" data-width="500px" data-height="300px"></div>
  <script type="text/javascript">
    $(document).ready(function () {
      $('.uwidget').UWidget({
        url: 'https://api.url.ext',
        handler: function (data) {
          // special remote data treatment needed ?
          return data;
        },
        template: 'item_tmpl',
        sort: {
          enabled: true,
          name: 'sort',
          values: ['created', 'updated', 'comments'],
          labels: ['Creation date', 'Update date', 'Comments']
        },
        direction: {
          enabled: true,
          name: 'direction',
          values: ['desc', 'asc'],
          labels: ['Descending', 'Ascending']
        },
        filters: {
          enabled: true,
          name: 'labels',
          values: ['bug', 'enhancement'],
          labels: ['Bug', 'Enhancement']
        }
      });
    });
  </script>
  <script type="text/html" id="item_tmpl">
    <li>
      <span class="gh-issue-comments">
        <%= comments %> <%= comments > 1 ? "comments" : "commment" %>
      </span>
      <span class="gh-issue-title">
        <a href="<%= html_url %>"><%= title %></a>
      </span>
    </li>
  </script>
</body>
</html>
```

## Configuration

You can pass some default parameters to the widget div:

  - `data-sort`: default sorting method
  - `data-direction`: default sorting direction
  - `data-filters="filter1, filter2, .."`: default active filters
  - `data-remote-options`: a valid JSON options object that allows you some
  control over the `$.ajax()` call made by the widget

## License

Released under the MIT License. See the bundled `LICENSE` file for
details.
