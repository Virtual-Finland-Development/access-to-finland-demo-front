import { ReactElement } from 'react';
import { Text } from '@chakra-ui/react';

export default function Fieldset({
  title,
  children,
}: {
  title: string;
  children: ReactElement;
}) {
  return (
    <fieldset
      style={{
        border: '1px solid #DCDCDC',
        padding: '0.5rem',
        borderRadius: '0.5rem',
        paddingBottom: '1.5rem',
      }}
    >
      <legend style={{ padding: '0 5px 0 5px', fontWeight: 500 }}>
        <Text color="blue.300">{title}</Text>
      </legend>
      {children}
    </fieldset>
  );
}
