# action-auto-assign-reviewers
A Github action to assign PR reviewers automatically from commits.

# How to use
Embed in your github action yaml.

```yaml
      - name: Auto assign reviewers
        id: auto_assign
        uses: Attsun1031/action-auto-assign-reviewers@v1
        with:
          pull-request-number: {{ SET TARGET PR NUMBER }}
```

