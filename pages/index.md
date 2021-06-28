import {FinkHighlighter} from '../lib/highlighter.fnk'
import data from '!!raw-loader!../lib/highlighter.fnk'


# fink


## expressions, operators, types

Fink source code consists of a sequence of expressions.

Most of the time expressions are separated by a new line
and have the same level of indentation.
It is also possible to use `,` to separate them.


```fink
expression_1
expression_2, expression_3
...
expression_n
```


#### assignments

Values of an expression can be assigned to a label within an expression block.
These labels can then be used within the same block to reference the value.

To make it easier to reason about the code, re-assigning a label is not allowed.


```fink
foobar = 123

spam = foobar + 321

spam
# 444
```


#### numbers

Fink has support for integers and floating point values.

There are integer, floating point, hexadecimal, octal and binary literals that can be used in code.

A `_` may be used as a spearator to make long numbers more readable.

```fink
# integer
1_234_567_890

# floating point
1.23456e-78

# octal
0123456780

# hexadecimal
0x0123456789abcdef

# binary
0b01010111
```

The arithmitic operators `+`, `-`, `*`, `/`, `^`, `%` can be used with number values.

```fink
add = 1 + 2
# 3

subract = 1 - 2
# -1

multiply = 2 * 3
# 6

divide = 3 / 2
# 1.5

to_the_power = 2^3
# 8

modulus = 4 % 2
# 0

combined_with = 1 + 2 * 3 + (1 + 2) * 3
# 16
```


Numbers can also be compared to each other using the comparison operators
`<`, `>`, `>=`, `<=`, `==`, `!=`.

The value of a comparison is always a boolean (true or false).

```fink
less_than = 1 < 2

less_than_or_equal = 2 <= 2

between = 1 < 2 < 3

greater_than = 2 > 1

greater_than_or_equal = 1 >= 1

equal_to = 2 == 2

not_equal = 1 != 2
```


#### booleans

There are two literals for boolean values that can be used in code.

```fink
true
false
```

Boolean values can be used with logical operators `and`, `or` and `not`. The value of a logical expression is always a boolean.

```fink
true and true
# true

true or false
# true

false or false
# false

not true
# false

not false
# true

1 < 2 and 2 < 3
# true
```


#### strings

For working with text data fink as strings, a sequence of unicode characters.
A string is any text delimited by `'`, `"` or ``` ` ```.

```fink
'foobar'
"spam's not ham"
`foo ' bar " spam \u263A`
```

Strings can span multiple lines, with block indentation automatically removed.

Strings support comparison operators only:

```fink
'abc' < 'cde'

'abc' <= 'abc'

'ABC' > 'abc'

'abc' >= 'abc'

'abc' == 'abc'

'spam' != 'ham'
```

Concatination of strings can be achieved using the `${...}` template expression syntax within strings.

```fink
`
  foo: ${1 + 2 + 3}
    bar spam
  ni
  \${escaped to avoid templating}
`

# foo: 6
#   bar spam
# ni
# ${escaped to avoid templating}
```

For more advanced templating, strings can be prefixed with a template-tag,
a function that will recieve all string parts and expression values for custom formatting.

E.g. fink/stdlib comes with a `raw` template tag to avoid having to use escape characters.

```
raw'foo \ / ${1234.456}'
```

The following escape characters are supported within a string:

* `\'` - single quote
* `\"` - double quote
* ```\` ``` - backtick
* `\\` - backslash
* `\n` - new line
* `\r` - carriage return
* `\v` - vertical tab
* `\t` - tab
* `\b` - backspace
* `\f` - form feed
* `\uXXXX` - UTF-16 hex code / Unicode code point between U+0000 and U+FFFF
* `\u{X}` ... `\u{XXXXXX}` - UTF-32 code unit / Unicode code point between U+0000 and U+10FFFF
* `\${` - prevents template expression evaluation


#### lists

Lists are immutable ordered collections of values of any kind.

There are two types of list expressions.

```fink
[1, 2, ['foo', 3]]

list:
  1, 2
  ['foo', 3]
```

There is a single operator 'in' that can be used with lists (and any other iterable value). It tests whether one value is container within another.

```fink
'foo' in ['foo', 'bar', 'spam']
# true

'ni' in ['foo', 'bar', 'spam']
# false
```

<!-- TODO add spread syntax docs here-->



#### records

Records are immutable unordered collections of key-value pairs.

Keys can be a string expression, a label, or parenthesized expression evaluating to a key.

Values can be any expression including an indented expression block.

To simplify including a value with the key being the value's label,
a shorthand key-value expression can be used.

There are two types of record expressions:

```fink
{key: 'value', 'foo bar': 123, (expr): {}, shorthand}

dict:
  key: 'value'
  'foo bar':  123
  (expr): {}
  shorthand
```

Records can be used with the `.` operator to get the values for a key.

```
foobar = {spam: 'ham', ni: 123}

foobar.spam
# 'ham'


key = 'spam'
foobar.(key)
# 'ham'
```

<!-- TODO add spread syntax docs here-->


#### functions

Functions are first class citizens in fink and can be passed around just like
any other value.

```fink
foobar = fn spam, ham:
  foo = '${spam} is ${ham}'
  '${foo}!'

foobar 'spam', 'ni'
# 'spam is ni!'
```


#### destructuring

To make working with lists and records easier, fink supports destructuring,
i.e. lists and record literals as left hand sides of an assignments or as parameters.

Labels, that would be used for elements in a list or as value for a key in a record, become labels in the local scope, with their values extracted from the value of the expression on the right hand side.

As with record and list literals, nesting, shorthands, empty elements and spreads are supported.

```fink
{foobar: {spam}, shrub: ni} = {foobar: {spam: 'ham'}, shrub: 123, ni: 456}

[spam, ni]
# 'ham' 123

{foo, ...rest} = {foo: 'bar', spam: 'ham', shrub: 'ni'}

[foo, rest]
# 'bar' {spam: 'ham', shrub: 'ni'}
```

<br />

```fink
[head, ...tail] = [1, 2, 3, 4, 5]

[head, tail]
# [1, [2, 3, 4, 5]]
```

<br />


```fink
[first, ..., last] = [1, 2, 3, 4, 5]

[first, last]
# [1, 5]
```

Destructuring also works for parameters in block expressions.
The parameters are simply treated as a list.

```fink
foo = fn [spam], {ham: ni=false}, , ...rest:
  [spam, ni, ...rest]

foo ['ham'], {}, 123, 456, 789
# ['ham', false, 456, 789]
```


## pattern matching

The `match obj:` block expression expects a value as parameter and contains a sequence of `condition: result` expressions as the body.

The result of the first condition matching the value passed in will be used as the value of the match expression.

The last condition should be an `else: result` expression, which matches anything.


#### matching exact values

```fink
get_matching = fn obj:
  match obj:
    123:
      'exact number'

    'foobar':
      'exact string'

    else:
      'no match'


get_matching 123
# 'exact number'

get_matching 'foobar'
# 'exact string'

get_matching 'ni'
# 'no match'
```


#### matching iterables


```fink
get_matching = fn obj:
  match obj:
    [1, ..., 1]:
      'start and end ${obj}'

    [1, [2, 3]]:
      'nested ${obj}'

    else:
      'no match'


get_matching [1, 2, 3, 2, 1]
# 'start and end [1, 2, 3, 2, 1]'

get_matching [1, 1]
# 'list start and end [1, 1]'

get_matching [1, [2, 3, 4]]
# 'nested [1, [2, 3, 4]]'

get_matching []
# 'no match'
```


#### matching records


```fink
get_matching = fn obj:
  match obj:
    {foo: 'bar', spam: 'ham'}:
      'object ${obj}'

    {foo: 'bar', spam: {ham: {}}}:
      'nested ${obj}'

    else:
      'no match'


get_matching {foo: 'bar', spam: 'ham', shrub: 'ni'}
# 'object {foo: 'bar', spam: 'ham', shrub: 'ni'}'

get_matching {foo: 'bar', spam: {ham: 'ni'}}
# 'nested {foo: 'bar', spam: {ham: 'ni'}}'

get_matching {}
# 'no match'
```


#### matching with partial application

Conditions using partial applications succeed if they evaluate to true,
using the object being matched as the partial value (i.e. in place of `?`).

When nesting a `?` within a list or record, the object being matched is the element or record field within the current nesting.


```fink
get_matching = fn obj:
  match obj:
    3 < length ?:
      'short iterable ${obj}'

    ? in ['foo', 'bar']:
      'is in list ${obj}'

    {foo: ? > 3}:
      'foo ${obj}'

    else:
      'no match'


get_matching 'ni'
# 'short iterable ni'

get_matching 'bar'
# 'is in list bar'

get_matching {foo: 42}
# 'foo {foo: 42}'

get_matching 'shrub'
# 'no match'
```


## partial application

The `?` can be used anywhere a label can be used and transforms
any outer expression into a function with `?` being the first argument.


```fink
is_even = 0 == ? % 2

is_even 1
# false
```

<br/>

```fink
add = fn a, b: a + b

add_123 = add ?, 123

add_123 321
# 444
```



## pipe

A pipe provides a way to call multiple functions successively, passing
the result of one call to the next, starting with the pipe's initial value:


```fink
pipe 1:
  fn a: a + 1 # 2
  fn b: b * 2 # 4
  fn c: c - 1 # 3

# 3
```


## iterables

Strings and lists are iterable collections, i.e. they allow each of their items
to be processed sequentially.


#### filtering

Keeping all items for which the condition block returns `true`:

```fink
items = pipe [1, 2, 3, 4]:
  filter item:
    0 == item % 2

[...items]
# [2, 4]
````

Keeping all while a condition holds `true`:

```fink
items = pipe [1, 2, 3, 4]:
  while item:
    item < 3

[...items]
# [1, 2]
```


<!-- TODO add examples with accu -->

#### mapping

Mapping transforms a sequence of items into a new sequence of items, replacing
each item with a new one returned by the map's block expression

```fink
items = pipe [1, 2, 3]:
  map item:
    item * 2

[...items]
# [2, 4, 6]
```

To make it easier to pass some state from one mapping step to the next, an accumulator can be added to the parameters and returned by using the tuple syntax.

In addition it is possible to use spread syntax to expand a single item into multiple.

```fink
items = pipe [1, 2, 3, 4]:
  map item, is_even_idx=false:
    all = match true:
      is_even_idx:
        [item, item]
      else:
        [item]

    (...all, not is_even_idx)

[...items]
# [1, 2, 2, 3, 4, 4]
```


#### generating items

```fink
range = fn start, stop:
  pipe start:
    unfold accu:
      (accu, accu + 1)

    while cntr:
      cntr <= stop

[...range 1, 5]
# [1, 2, 3, 4, 5]
```


#### reducing items to single value

```fink
obj = pipe [['foo', 1], ['bar', 2]]:
  fold [key, value], accu={}:
    {...accu, (key): value}

obj
# {foo: 1, bar: 2}
```


## async


## javascript interop

