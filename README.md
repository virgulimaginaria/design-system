# Primeira Academia Design System

The Primeira Academia Design System is a public, reusable UI foundation for building consistent web applications across the Primeira Academia ecosystem.

Its purpose is to provide a shared set of design tokens, accessible UI primitives, reusable components and interaction patterns that applications can consume instead of implementing their own visual foundations.

The Design System is intentionally **application-agnostic and domain-agnostic**. Components published here should represent reusable UI capabilities rather than concepts tied to a specific product, business process or application.

## Brand independence

This repository is intentionally **free of private or restricted brand assets**.

It may define the tokens, interfaces, slots or extension points required to apply branding, but it does not contain licensed fonts, restricted logos, private illustrations or other assets that should not be publicly distributed.

Applications consuming the Design System may provide their own brand layer separately.

## Public by design

This repository is public by design.

Everything committed here must therefore be safe to expose publicly and must not depend on internal infrastructure, environment configuration, credentials, customer data, operational details or private business information.

Examples and documentation must use fictional or generic data.

## Using the Design System

Applications should use the Design System as the default source for reusable UI.

Before implementing a new UI component inside an application:

1. Check whether the Design System already provides the required capability.
2. If it does not, determine whether the capability is sufficiently generic and reusable to belong in the Design System.
3. Only keep the implementation application-local when it is specific to that application or to a business domain.

The Design System should contain reusable UI capabilities.

Business components remain in the applications that own those concepts.

## License

This project is licensed under the MIT License.

The MIT license applies to the source code in this repository and does not grant rights to Primeira Academia or Vírgulimaginária trademarks, logos or other brand assets.
