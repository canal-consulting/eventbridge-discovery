# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### EventBridgeDiscovery <a name="EventBridgeDiscovery" id="eventbridge-discovery.EventBridgeDiscovery"></a>

#### Initializers <a name="Initializers" id="eventbridge-discovery.EventBridgeDiscovery.Initializer"></a>

```typescript
import { EventBridgeDiscovery } from 'eventbridge-discovery'

new EventBridgeDiscovery(scope: Construct, id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#eventbridge-discovery.EventBridgeDiscovery.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#eventbridge-discovery.EventBridgeDiscovery.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="eventbridge-discovery.EventBridgeDiscovery.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="eventbridge-discovery.EventBridgeDiscovery.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#eventbridge-discovery.EventBridgeDiscovery.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="eventbridge-discovery.EventBridgeDiscovery.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#eventbridge-discovery.EventBridgeDiscovery.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="eventbridge-discovery.EventBridgeDiscovery.isConstruct"></a>

```typescript
import { EventBridgeDiscovery } from 'eventbridge-discovery'

EventBridgeDiscovery.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="eventbridge-discovery.EventBridgeDiscovery.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#eventbridge-discovery.EventBridgeDiscovery.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#eventbridge-discovery.EventBridgeDiscovery.property.eventBucket">eventBucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="eventbridge-discovery.EventBridgeDiscovery.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `eventBucket`<sup>Required</sup> <a name="eventBucket" id="eventbridge-discovery.EventBridgeDiscovery.property.eventBucket"></a>

```typescript
public readonly eventBucket: IBucket;
```

- *Type:* aws-cdk-lib.aws_s3.IBucket

---





