import { Tag, TagProps } from "@chakra-ui/react";

export const InlineTag = (props: TagProps) => (
  <Tag
    as="span"
    display={"inline"}
    p={0}
    lineHeight={"unset"}
    fontSize={"unset"}
    minH={"unset"}
    {...props}
  />
);

export const InlineButton = (props: TagProps) => (
  <InlineTag as="button" {...props} />
);
